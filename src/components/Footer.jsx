import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, Mail, Facebook, Instagram } from 'lucide-react'
import { useData } from '../context/DataContext'
import { waLink } from '../lib/whatsapp'

export default function Footer() {
  const { settings: s } = useData()
  return (
    <footer className="relative overflow-hidden bg-ink-950 text-white/70">
      <div className="dots-bg absolute inset-0 opacity-40" />
      <div className="container-x relative grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="" className="h-14 w-14 rounded-full ring-2 ring-sun-500" />
            <div className="font-display text-4xl text-white">{s.name}</div>
          </div>
          <p className="mt-4 text-sm leading-relaxed">Fresh, hot and delicious fast food – burgers, shawarma, wings, fries and chaat. Flavor in every bite!</p>
          <div className="mt-5 flex gap-3">
            {s.facebook && <a href={s.facebook} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-brand-600"><Facebook size={18} /></a>}
            {s.instagram && <a href={s.instagram} target="_blank" rel="noreferrer" className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-brand-600"><Instagram size={18} /></a>}
            <a href={waLink(s.whatsapp, 'Assalam o Alaikum!')} target="_blank" rel="noreferrer" className="flex h-10 items-center rounded-full bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-500">WhatsApp</a>
          </div>
        </div>
        <div>
          <h4 className="mb-4 font-display text-2xl tracking-wide text-sun-400">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            {[['/', 'Home'], ['/menu', 'Menu'], ['/deals', 'Deals'], ['/about', 'About Us'], ['/contact', 'Contact'], ['/order', 'Your Cart']].map(([to, l]) => (
              <li key={to}><Link to={to} className="transition hover:text-white hover:underline">{l}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-2xl tracking-wide text-sun-400">Contact Us</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-brand-400" /> {s.address}</li>
            <li className="flex gap-3"><Phone size={18} className="shrink-0 text-brand-400" /> {s.phone}</li>
            <li className="flex gap-3"><Mail size={18} className="shrink-0 text-brand-400" /> {s.email}</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-display text-2xl tracking-wide text-sun-400">Timing</h4>
          <p className="flex gap-3 text-sm"><Clock size={18} className="shrink-0 text-brand-400" /> {s.hours}</p>
          <Link to="/menu" className="btn-primary mt-6 !py-2.5 text-sm">Order Now</Link>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs">
        © {new Date().getFullYear()} {s.name} {s.tagline}. All rights reserved.
      </div>
    </footer>
  )
}
