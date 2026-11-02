import { useEffect, useMemo, useRef, useState } from 'react'
import { Phone, MessageCircle, MapPin, Trash2, Bell, BellOff, Printer, Navigation } from 'lucide-react'
import { db } from '../../lib/db'
import { money, timeAgo } from '../../lib/utils'
import { normalizePhone } from '../../lib/whatsapp'
import { useData } from '../../context/DataContext'
import { STATUS, StatusBadge } from './AdminUI'

function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    ;[0, 0.22, 0.44].forEach((t, k) => {
      const o = ctx.createOscillator(); const g = ctx.createGain()
      o.frequency.value = k === 2 ? 1040 : 780; o.type = 'sine'
      g.gain.setValueAtTime(0.0001, ctx.currentTime + t)
      g.gain.exponentialRampToValueAtTime(0.35, ctx.currentTime + t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + t + 0.2)
      o.connect(g).connect(ctx.destination); o.start(ctx.currentTime + t); o.stop(ctx.currentTime + t + 0.22)
    })
  } catch { /* ignore */ }
}

const FLOW = { new: ['preparing', 'Accept order'], preparing: ['delivery', 'Send for delivery'], delivery: ['delivered', 'Mark delivered'] }

function printOrder(o, shop) {
  const w = window.open('', '_blank', 'width=380,height=640')
  if (!w) return
  w.document.write(`<pre style="font:14px monospace">${shop}\n${o.orderNo}  ${new Date(o.createdAt).toLocaleString()}\n--------------------------\n${o.items.map((i) => `${i.qty} x ${i.name}${i.variant ? ` (${i.variant})` : ''}  ${i.qty * i.price}`).join('\n')}\n--------------------------\nDelivery: ${o.deliveryFee}\nTOTAL: ${o.total}\n\n${o.customer.name}\n${o.customer.phone}\n${o.customer.address}\n${o.customer.notes || ''}</pre>`)
  w.document.close(); w.print()
}

export default function Orders() {
  const { settings } = useData()
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('active')
  const [sound, setSound] = useState(true)
  const seen = useRef(null)

  useEffect(() => db.subscribe('orders', (arr) => setOrders(arr.sort((a, b) => b.createdAt - a.createdAt))), [])

  // naya order aate hi awaaz
  useEffect(() => {
    const ids = new Set(orders.map((o) => o.id))
    if (seen.current && [...ids].some((id) => !seen.current.has(id)) && sound) beep()
    seen.current = ids
  }, [orders, sound])

  const stats = useMemo(() => {
    const today = new Date(); today.setHours(0, 0, 0, 0)
    const t = orders.filter((o) => o.createdAt >= today.getTime())
    return {
      newCount: orders.filter((o) => o.status === 'new').length,
      today: t.length,
      revenue: t.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0),
      all: orders.length,
    }
  }, [orders])

  const list = orders.filter((o) => (tab === 'active' ? ['new', 'preparing', 'delivery'].includes(o.status) : tab === 'all' ? true : o.status === tab))
  const setStatus = (o, status) => db.save('orders', o.id, { status })

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-5xl">Orders</h1><p className="text-sm text-ink-900/55">Live orders – new orders appear here instantly.</p></div>
        <button onClick={() => { setSound(!sound); if (!sound) beep() }} className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-card">
          {sound ? <Bell size={16} className="text-emerald-600" /> : <BellOff size={16} />} Sound {sound ? 'on' : 'off'}
        </button>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[['New orders', stats.newCount, 'bg-brand-600 text-white'], ["Today's orders", stats.today, 'bg-white'], ["Today's sales", money(stats.revenue), 'bg-white'], ['Total orders', stats.all, 'bg-white']].map(([l, v, c]) => (
          <div key={l} className={`rounded-3xl p-5 shadow-card ${c}`}>
            <div className="text-xs font-bold uppercase tracking-wider opacity-70">{l}</div>
            <div className="mt-1 font-display text-4xl sm:text-5xl">{v}</div>
          </div>
        ))}
      </div>

      <div className="no-scrollbar mb-6 flex gap-2 overflow-x-auto">
        {[['active', 'Active'], ['new', 'New'], ['delivered', 'Delivered'], ['cancelled', 'Cancelled'], ['all', 'All']].map(([k, l]) => (
          <button key={k} onClick={() => setTab(k)} className={`shrink-0 rounded-full px-5 py-2 text-sm font-bold transition ${tab === k ? 'bg-ink-900 text-white' : 'bg-white text-ink-900 hover:bg-brand-100'}`}>{l}</button>
        ))}
      </div>

      {list.length === 0 && <div className="rounded-3xl bg-white p-16 text-center text-ink-900/50 shadow-card">No orders here yet.</div>}

      <div className="grid gap-5 xl:grid-cols-2">
        {list.map((o) => {
          const next = FLOW[o.status]
          const loc = o.customer.location
          return (
            <article key={o.id} className={`overflow-hidden rounded-3xl bg-white shadow-card ${o.status === 'new' ? 'ring-2 ring-brand-600' : ''}`}>
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-black/5 bg-cream/60 px-5 py-3">
                <div className="flex items-center gap-3"><span className="font-display text-3xl">{o.orderNo}</span><StatusBadge status={o.status} /></div>
                <span className="text-xs text-ink-900/55">{timeAgo(o.createdAt)} • {new Date(o.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="space-y-4 p-5">
                <div>
                  <div className="text-lg font-bold">{o.customer.name}</div>
                  <div className="mt-1 flex items-start gap-2 text-sm text-ink-900/70"><MapPin size={16} className="mt-0.5 shrink-0 text-brand-600" /> <span>{o.customer.address}{o.customer.landmark ? ` (${o.customer.landmark})` : ''}</span></div>
                  {o.customer.notes && <div className="mt-2 rounded-xl bg-sun-300/40 px-3 py-2 text-sm">📝 {o.customer.notes}</div>}
                </div>
                <ul className="divide-y divide-black/5 rounded-2xl bg-cream/60 px-4 text-sm">
                  {o.items.map((i, k) => <li key={k} className="flex justify-between py-2"><span><b>{i.qty} x</b> {i.name}{i.variant ? ` (${i.variant})` : ''}</span><b>{money(i.qty * i.price)}</b></li>)}
                  <li className="flex justify-between py-2 text-ink-900/60"><span>Delivery</span><span>{money(o.deliveryFee)}</span></li>
                  <li className="flex justify-between py-2 text-base"><b>Total (COD)</b><b className="text-brand-600">{money(o.total)}</b></li>
                </ul>
                <div className="flex flex-wrap gap-2">
                  <a href={`tel:${o.customer.phone}`} className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-white"><Phone size={14} /> {o.customer.phone}</a>
                  <a href={`https://wa.me/${normalizePhone(o.customer.phone)}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-bold text-white"><MessageCircle size={14} /> WhatsApp</a>
                  {loc && <a href={loc.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-sky-600 px-4 py-2 text-xs font-bold text-white"><Navigation size={14} /> Map location</a>}
                  <button onClick={() => printOrder(o, settings.name)} className="inline-flex items-center gap-2 rounded-full bg-black/5 px-4 py-2 text-xs font-bold"><Printer size={14} /> Print</button>
                </div>
                <div className="flex flex-wrap items-center gap-2 border-t border-black/5 pt-4">
                  {next && <button onClick={() => setStatus(o, next[0])} className="btn-primary !px-5 !py-2.5 text-sm">{next[1]}</button>}
                  {o.status !== 'cancelled' && o.status !== 'delivered' && <button onClick={() => confirm('Cancel this order?') && setStatus(o, 'cancelled')} className="rounded-full border-2 border-ink-900/15 px-4 py-2 text-sm font-bold hover:border-brand-600 hover:text-brand-600">Cancel</button>}
                  <button onClick={() => confirm('This order will be deleted permanently. Continue?') && db.remove('orders', o.id)} className="ml-auto text-ink-900/30 hover:text-brand-600" aria-label="delete"><Trash2 size={18} /></button>
                </div>
              </div>
            </article>
          )
        })}
      </div>
    </div>
  )
}
