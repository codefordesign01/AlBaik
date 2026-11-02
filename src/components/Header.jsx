import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingBag, Phone } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'

const links = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/deals', label: 'Deals' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { pathname } = useLocation()
  const { count } = useCart()
  const { settings } = useData()
  const solid = scrolled || pathname !== '/'

  useEffect(() => { setOpen(false) }, [pathname])
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : '' }, [open])

  const linkCls = ({ isActive }) =>
    `relative px-1 py-2 text-sm font-semibold uppercase tracking-wider transition after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:bg-sun-500 after:transition-transform ${isActive ? 'text-sun-400 after:scale-x-100' : 'text-white/90 hover:text-white after:scale-x-0 hover:after:scale-x-100'}`

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${solid ? 'bg-ink-950/95 py-2 shadow-xl backdrop-blur' : 'bg-gradient-to-b from-black/60 to-transparent py-4'}`}>
        <div className="container-x flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-3">
            <img src="/logo.png" alt={settings.name} className="h-12 w-12 rounded-full ring-2 ring-sun-500 sm:h-14 sm:w-14" />
            <div className="leading-none">
              <div className="font-display text-3xl text-white sm:text-4xl">{settings.name}</div>
              <div className="text-[10px] font-semibold uppercase tracking-[.35em] text-sun-400">{settings.tagline}</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((l) => <NavLink key={l.to} to={l.to} end={l.to === '/'} className={linkCls}>{l.label}</NavLink>)}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hidden items-center gap-2 text-sm font-semibold text-white/90 hover:text-sun-400 xl:flex">
              <Phone size={16} /> {settings.phone}
            </a>
            <Link to="/order" className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" aria-label="Cart">
              <ShoppingBag size={20} />
              {count > 0 && <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-600 px-1 text-[11px] font-bold">{count}</span>}
            </Link>
            <Link to="/menu" className="btn-primary hidden !py-2.5 text-sm sm:inline-flex">Order Now</Link>
            <button onClick={() => setOpen(true)} className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white lg:hidden" aria-label="Menu">
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile side drawer */}
      <div className={`fixed inset-0 z-[60] lg:hidden ${open ? '' : 'pointer-events-none'}`}>
        <div onClick={() => setOpen(false)} className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0'}`} />
        <aside className={`absolute right-0 top-0 flex h-full w-[82%] max-w-sm flex-col bg-ink-950 p-6 shadow-2xl transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-11 w-11 rounded-full ring-2 ring-sun-500" />
              <span className="font-display text-3xl text-white">{settings.name}</span>
            </div>
            <button onClick={() => setOpen(false)} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white" aria-label="Close"><X size={20} /></button>
          </div>
          <nav className="mt-10 flex flex-col">
            {links.map((l, i) => (
              <NavLink key={l.to} to={l.to} end={l.to === '/'} style={{ transitionDelay: `${open ? i * 60 : 0}ms` }}
                className={({ isActive }) => `border-b border-white/10 py-4 font-display text-3xl tracking-wide transition-all duration-500 ${open ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0'} ${isActive ? 'text-sun-400' : 'text-white'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-auto space-y-3">
            <Link to="/order" className="btn-sun w-full"><ShoppingBag size={18} /> Cart ({count})</Link>
            <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-ghost w-full"><Phone size={18} /> {settings.phone}</a>
          </div>
        </aside>
      </div>
    </>
  )
}
