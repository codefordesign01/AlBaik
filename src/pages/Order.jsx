import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Trash2, MapPin, Loader2, ShoppingBag, MessageCircle, ArrowLeft } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { db } from '../lib/db'
import { money } from '../lib/utils'
import { autoNotify, orderMessage, waLink } from '../lib/whatsapp'
import FoodImage from '../components/FoodImage'
import PageHero from '../components/PageHero'

export default function Order() {
  const { lines, setQty, remove, clear, subtotal } = useCart()
  const { settings: s } = useData()
  const nav = useNavigate()
  const [f, setF] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ff_customer')) || { name: '', phone: '', address: '', landmark: '', notes: '' } } catch { return { name: '', phone: '', address: '', landmark: '', notes: '' } }
  })
  const [loc, setLoc] = useState(null)
  const [locBusy, setLocBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const fee = lines.length ? Number(s.deliveryFee) || 0 : 0
  const total = subtotal + fee
  const belowMin = subtotal < (Number(s.minOrder) || 0)

  const getLocation = () => {
    if (!navigator.geolocation) return setErr('Your browser does not support location.')
    setLocBusy(true); setErr('')
    navigator.geolocation.getCurrentPosition(
      (p) => {
        const { latitude: lat, longitude: lng } = p.coords
        setLoc({ lat, lng, link: `https://maps.google.com/?q=${lat},${lng}` })
        setLocBusy(false)
      },
      () => { setErr('Could not get your location. Please type your address.'); setLocBusy(false) },
      { enableHighAccuracy: true, timeout: 12000 },
    )
  }

  const submit = async (e) => {
    e.preventDefault()
    if (!lines.length) return
    if (belowMin) return setErr(`Minimum order is ${money(s.minOrder)}.`)
    setBusy(true); setErr('')
    const win = window.open('', '_blank') // open on click to avoid popup blockers
    try {
      const order = {
        orderNo: '#' + String(Date.now()).slice(-6),
        customer: { ...f, location: loc || null },
        items: lines.map((l) => ({ name: l.name, variant: l.variant, qty: l.qty, price: l.price, type: l.type })),
        subtotal, deliveryFee: fee, total, payment: 'Cash on Delivery', status: 'new', createdAt: Date.now(),
      }
      await db.add('orders', order)
      localStorage.setItem('ff_customer', JSON.stringify(f))
      localStorage.setItem('ff_last_order', JSON.stringify(order))
      const text = orderMessage(order, s.name)
      autoNotify(s.whatsapp, text)
      const link = waLink(s.whatsapp, text)
      if (win) win.location.href = link
      clear()
      nav('/order/success')
    } catch (ex) {
      console.error(ex)
      if (win) win.close()
      setErr('Something went wrong placing your order. Please try again or call us.')
    } finally { setBusy(false) }
  }

  if (!lines.length) {
    return (
      <>
        <PageHero title="Your Cart" />
        <div className="container-x py-20 text-center">
          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-brand-100 text-brand-600"><ShoppingBag size={48} /></div>
          <h2 className="mt-6 font-display text-4xl">Your cart is empty</h2>
          <p className="mt-2 text-ink-900/60">Pick some tasty items from the menu.</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/menu" className="btn-primary">View Menu</Link>
            <Link to="/deals" className="btn-outline">View Deals</Link>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <PageHero title="Checkout" sub="Review your cart, enter your details and place your order." />
      <section className="py-10 sm:py-16">
        <form onSubmit={submit} className="container-x grid gap-8 lg:grid-cols-5">
          <div className="space-y-8 lg:col-span-3">
            <div className="card p-5 sm:p-7">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-3xl">Your Order</h2>
                <Link to="/menu" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600"><ArrowLeft size={15} /> Add more</Link>
              </div>
              <ul className="divide-y divide-ink-900/10">
                {lines.map((l) => (
                  <li key={l.key} className="flex items-center gap-4 py-4">
                    <FoodImage src={l.image} alt={l.name} className="h-16 w-16 shrink-0 rounded-2xl sm:h-20 sm:w-20" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-bold">{l.name}</div>
                      {l.variant && <div className="text-xs text-ink-900/55">{l.variant}</div>}
                      <div className="mt-1 text-sm font-bold text-brand-600">{money(l.price)}</div>
                    </div>
                    <div className="flex items-center gap-1 rounded-full bg-cream p-1">
                      <button type="button" onClick={() => setQty(l.key, l.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-brand-600 hover:text-white" aria-label="decrease"><Minus size={14} /></button>
                      <span className="w-7 text-center text-sm font-bold">{l.qty}</span>
                      <button type="button" onClick={() => setQty(l.key, l.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow hover:bg-brand-600 hover:text-white" aria-label="increase"><Plus size={14} /></button>
                    </div>
                    <div className="hidden w-24 text-right font-bold sm:block">{money(l.price * l.qty)}</div>
                    <button type="button" onClick={() => remove(l.key)} className="text-ink-900/35 hover:text-brand-600" aria-label="remove"><Trash2 size={18} /></button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card p-5 sm:p-7">
              <h2 className="mb-5 font-display text-3xl">Delivery Details</h2>
              <div className="grid gap-5 sm:grid-cols-2">
                <div><label className="label">Your name *</label><input required className="input" value={f.name} onChange={set('name')} placeholder="Ahmed Ali" /></div>
                <div><label className="label">Phone number *</label><input required type="tel" className="input" value={f.phone} onChange={set('phone')} placeholder="03XX XXXXXXX" /></div>
                <div className="sm:col-span-2"><label className="label">Full address *</label><textarea required rows={3} className="input resize-none" value={f.address} onChange={set('address')} placeholder="House / flat no., street, area, city" /></div>
                <div><label className="label">Landmark</label><input className="input" value={f.landmark} onChange={set('landmark')} placeholder="Near the mosque..." /></div>
                <div><label className="label">Special note</label><input className="input" value={f.notes} onChange={set('notes')} placeholder="Less spicy, extra sauce..." /></div>
              </div>
              <button type="button" onClick={getLocation} disabled={locBusy}
                className={`mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed px-4 py-3 text-sm font-semibold transition ${loc ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-brand-600/40 text-brand-700 hover:bg-brand-50'}`}>
                {locBusy ? <Loader2 size={18} className="animate-spin" /> : <MapPin size={18} />}
                {loc ? 'Location added ✓ (makes delivery easier)' : 'Also share my current location (optional)'}
              </button>
            </div>
          </div>

          <aside className="lg:col-span-2">
            <div className="card sticky top-28 overflow-hidden">
              <div className="bg-ink-950 p-6 text-white"><h2 className="font-display text-3xl">Bill Summary</h2></div>
              <div className="space-y-3 p-6">
                <div className="flex justify-between text-sm"><span className="text-ink-900/60">Subtotal</span><b>{money(subtotal)}</b></div>
                <div className="flex justify-between text-sm"><span className="text-ink-900/60">Delivery charges</span><b>{money(fee)}</b></div>
                <div className="flex items-center justify-between border-t border-dashed border-ink-900/20 pt-4">
                  <span className="font-display text-2xl">Total</span>
                  <span className="font-display text-4xl text-brand-600">{money(total)}</span>
                </div>
                <div className="rounded-xl bg-sun-300/40 px-4 py-2.5 text-sm font-semibold text-ink-900">💵 Payment: Cash on Delivery</div>
                {belowMin && <p className="text-sm font-medium text-brand-700">Minimum order: {money(s.minOrder)}</p>}
                {err && <p className="rounded-xl bg-brand-50 px-4 py-3 text-sm font-medium text-brand-700">{err}</p>}
                <button disabled={busy || belowMin} className="btn-primary w-full !py-4 text-base">
                  {busy ? <Loader2 className="animate-spin" size={20} /> : <MessageCircle size={20} />} Confirm Order
                </button>
                <p className="text-center text-xs text-ink-900/50">After you confirm, WhatsApp opens with your order details pre-filled – just press <b>Send</b>.</p>
              </div>
            </div>
          </aside>
        </form>
      </section>
    </>
  )
}
