import { Link } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Phone } from 'lucide-react'
import { useData } from '../context/DataContext'
import { money } from '../lib/utils'
import { orderMessage, waLink } from '../lib/whatsapp'

export default function OrderSuccess() {
  const { settings: s } = useData()
  let order = null
  try { order = JSON.parse(localStorage.getItem('ff_last_order')) } catch { /* ignore */ }

  if (!order) {
    return <div className="container-x py-40 text-center"><Link to="/menu" className="btn-primary">View Menu</Link></div>
  }
  return (
    <section className="bg-gradient-to-b from-brand-700 to-ink-950 pb-20 pt-32">
      <div className="container-x max-w-2xl">
        <div className="card animate-pop overflow-hidden text-center">
          <div className="bg-emerald-500 py-10 text-white">
            <CheckCircle2 size={72} className="mx-auto" />
            <h1 className="mt-3 font-display text-5xl">Thank you! Order received</h1>
            <p className="mt-1 font-semibold text-white/90">Order number {order.orderNo}</p>
          </div>
          <div className="space-y-5 p-6 sm:p-9">
            <p className="text-ink-900/70">Our team is preparing your order. If WhatsApp did not open automatically, tap the button below and press <b>Send</b> so we can confirm it right away.</p>
            <a href={waLink(s.whatsapp, orderMessage(order, s.name))} target="_blank" rel="noreferrer" className="btn w-full bg-emerald-600 !py-4 text-white hover:bg-emerald-500"><MessageCircle size={20} /> Send order on WhatsApp</a>
            <ul className="divide-y divide-ink-900/10 rounded-2xl bg-cream p-4 text-left text-sm">
              {order.items.map((i, k) => (
                <li key={k} className="flex justify-between py-2"><span>{i.qty} x {i.name}{i.variant ? ` (${i.variant})` : ''}</span><b>{money(i.qty * i.price)}</b></li>
              ))}
              <li className="flex justify-between py-2"><span>Delivery</span><b>{money(order.deliveryFee)}</b></li>
              <li className="flex justify-between py-2 text-base"><b>Total</b><b className="text-brand-600">{money(order.total)}</b></li>
            </ul>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/menu" className="btn-outline">Order more</Link>
              <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="btn bg-ink-900 text-white hover:bg-brand-600"><Phone size={18} /> Call us</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
