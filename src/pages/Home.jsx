import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Truck, Flame, ShieldCheck, Clock, MousePointerClick, ShoppingBag, MessageCircle, ChevronDown } from 'lucide-react'
import { useData } from '../context/DataContext'
import { HERO_SLIDES } from '../data/images'
import ItemCard from '../components/ItemCard'
import DealCard from '../components/DealCard'
import SectionTitle from '../components/SectionTitle'
import Reveal from '../components/Reveal'
import { waLink } from '../lib/whatsapp'
import { money } from '../lib/utils'

function Hero() {
  const { settings } = useData()
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % HERO_SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [])
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-ink-950">
      {HERO_SLIDES.map((s, k) => (
        <div key={s.img} className={`absolute inset-0 transition-opacity duration-[1400ms] ${k === i ? 'opacity-100' : 'opacity-0'}`}>
          <img src={s.img} alt={s.label} className={`h-full w-full object-cover ${k === i ? 'animate-kenburns' : ''}`} fetchpriority={k === 0 ? 'high' : 'auto'} onError={(e) => { e.currentTarget.style.display = 'none' }} />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950 via-ink-950/80 to-brand-900/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-transparent to-ink-950/50" />
      <div className="dots-bg absolute inset-0 opacity-40" />

      <div className="container-x relative z-10 pb-24 pt-32">
        <div className="max-w-3xl animate-slideUp">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[.2em] text-sun-400 ring-1 ring-white/20 backdrop-blur">
            <Flame size={15} className="text-brand-400" /> Hot • Crispy • Fresh
          </span>
          <h1 className="mt-6 font-display text-[3.4rem] leading-[.95] text-white sm:text-7xl lg:text-[6.5rem]">
            {settings.heroTitle.split(' ').map((w, k, a) => (
              <span key={k} className={k >= a.length - 3 ? 'text-sun-400' : ''}>{w} </span>
            ))}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80">{settings.heroSub}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/menu" className="btn-primary text-base">View Menu <ArrowRight size={18} /></Link>
            <Link to="/deals" className="btn-sun text-base">🔥 Hot Deals</Link>
          </div>
          <div className="mt-12 flex flex-wrap gap-x-10 gap-y-5">
            {[['4.9★', 'Customer rating'], ['30 min', 'Fast delivery'], ['100%', 'Fresh & halal']].map(([a, b]) => (
              <div key={b}>
                <div className="font-display text-4xl text-white">{a}</div>
                <div className="text-xs uppercase tracking-widest text-white/60">{b}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2">
        {HERO_SLIDES.map((s, k) => (
          <button key={s.img} onClick={() => setI(k)} aria-label={s.label}
            className={`h-2 rounded-full transition-all duration-500 ${k === i ? 'w-10 bg-sun-500' : 'w-2 bg-white/50 hover:bg-white'}`} />
        ))}
      </div>
      <a href="#famous" className="absolute bottom-6 right-6 z-10 hidden animate-bounce text-white/70 md:block" aria-label="Scroll"><ChevronDown size={32} /></a>
      <div className="absolute bottom-8 right-8 z-10 hidden rounded-2xl bg-white/10 px-5 py-3 text-right backdrop-blur ring-1 ring-white/20 lg:block">
        <div className="text-[10px] uppercase tracking-[.3em] text-sun-400">Now showing</div>
        <div className="font-display text-2xl text-white">{HERO_SLIDES[i].label}</div>
      </div>
    </section>
  )
}

function Marquee() {
  const words = ['Burgers', 'Shawarma', 'Hot Wings', 'Crispy Fries', 'Chaat', 'Shakes', 'Fresh Juice', 'Zinger']
  const row = [...words, ...words]
  return (
    <div className="overflow-hidden bg-brand-600 py-4 text-white">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {[...row, ...row].map((w, k) => (
          <span key={k} className="mx-6 flex items-center gap-12 font-display text-3xl tracking-wider">{w} <Star size={20} className="fill-sun-400 text-sun-400" /></span>
        ))}
      </div>
    </div>
  )
}

function Famous() {
  const { items } = useData()
  const list = items.filter((i) => i.popular && i.available !== false).slice(0, 8)
  const shown = list.length ? list : items.slice(0, 8)
  return (
    <section id="famous" className="relative py-20 sm:py-28">
      <div className="container-x">
        <SectionTitle kicker="Customer Favorites" title="Our Famous Items" sub="The dishes our customers keep coming back for." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((it, k) => <Reveal key={it.id} delay={(k % 4) * 90}><ItemCard item={it} /></Reveal>)}
        </div>
      </div>
    </section>
  )
}

function MenuPreview() {
  const { categories, items } = useData()
  const cats = categories.filter((c) => items.some((i) => i.category === c.id))
  const [active, setActive] = useState(null)
  const cur = active || cats[0]?.id
  const list = items.filter((i) => i.category === cur).slice(0, 6)
  return (
    <section className="relative overflow-hidden bg-white py-20 sm:py-28">
      <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-sun-400/20 blur-3xl" />
      <div className="absolute -right-32 bottom-10 h-72 w-72 rounded-full bg-brand-500/15 blur-3xl" />
      <div className="container-x relative">
        <SectionTitle kicker="Our Menu" title="Pick Your Favorite" sub="From shawarma to shakes – everything in one place." />
        <div className="no-scrollbar -mx-4 mb-10 flex gap-3 overflow-x-auto px-4 sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
          {cats.map((c) => (
            <button key={c.id} onClick={() => setActive(c.id)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-bold transition ${c.id === cur ? 'bg-brand-600 text-white shadow-glow' : 'bg-cream text-ink-900 hover:bg-brand-100'}`}>
              <span className="mr-1.5">{c.emoji}</span>{c.name}
            </button>
          ))}
        </div>
        <div key={cur} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((it, k) => <Reveal key={it.id} delay={k * 70}><ItemCard item={it} /></Reveal>)}
        </div>
        <div className="mt-12 text-center"><Link to="/menu" className="btn-outline">View Full Menu <ArrowRight size={18} /></Link></div>
      </div>
    </section>
  )
}

function DealsSection() {
  const { deals } = useData()
  const list = deals.filter((d) => d.active !== false).slice(0, 3)
  if (!list.length) return null
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 py-20 sm:py-28">
      <div className="dots-bg absolute inset-0" />
      <div className="absolute -right-20 -top-20 h-96 w-96 animate-floaty rounded-full bg-sun-500/30 blur-3xl" />
      <div className="container-x relative">
        <SectionTitle light kicker="Super Savings" title="Hot Deals Made For You" sub="Low prices, big flavor – tasty combos with free drinks." />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {list.map((d, k) => <Reveal key={d.id} delay={k * 100}><DealCard deal={d} dark /></Reveal>)}
        </div>
        <div className="mt-12 text-center"><Link to="/deals" className="btn-sun">View All Deals <ArrowRight size={18} /></Link></div>
      </div>
    </section>
  )
}

function Why() {
  const feats = [
    [Flame, 'Always Hot', 'Every order is freshly made the moment you place it.'],
    [Truck, 'Fast Delivery', 'Straight to your door, quick and safe.'],
    [ShieldCheck, 'Clean & Halal', 'Quality ingredients and strict hygiene.'],
    [Clock, 'Open Late', 'Open till late – hunger strikes any time.'],
  ]
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <SectionTitle kicker="Why us?" title="Why Choose Us" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {feats.map(([Icon, t, d], k) => (
            <Reveal key={t} delay={k * 90}>
              <div className="card group h-full p-7 text-center transition hover:-translate-y-1.5 hover:shadow-2xl">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:rotate-6 group-hover:bg-brand-600 group-hover:text-white"><Icon size={30} /></div>
                <h3 className="mt-5 font-display text-2xl">{t}</h3>
                <p className="mt-2 text-sm text-ink-900/60">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Steps() {
  const steps = [
    [MousePointerClick, '1. Choose', 'Pick your favorites from the menu or deals.'],
    [ShoppingBag, '2. Place Order', 'Review your cart, enter your name and address, and submit.'],
    [MessageCircle, '3. WhatsApp Confirm', 'Your order goes straight to our WhatsApp and dashboard.'],
    [Truck, '4. Enjoy', 'Hot, fresh food at your doorstep.'],
  ]
  return (
    <section className="bg-ink-950 py-20 text-white sm:py-28">
      <div className="container-x">
        <SectionTitle light kicker="Easy process" title="How To Order" />
        <div className="grid gap-8 md:grid-cols-4">
          {steps.map(([Icon, t, d], k) => (
            <Reveal key={t} delay={k * 100}>
              <div className="relative text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 shadow-glow"><Icon size={34} /></div>
                <h3 className="mt-5 font-display text-2xl text-sun-400">{t}</h3>
                <p className="mt-2 text-sm text-white/65">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  const r = [
    ['Ahmed R.', 'Best zinger burger ever! Crispy and juicy. Delivery was on time too.'],
    ['Sana K.', 'The shawarma and fries combo was amazing. The mint margarita is a must-try.'],
    ['Usman T.', 'Great deals, perfect for the family. Will definitely order again.'],
  ]
  return (
    <section className="py-20 sm:py-28">
      <div className="container-x">
        <SectionTitle kicker="What customers say" title="Loved By Our Customers" />
        <div className="grid gap-6 md:grid-cols-3">
          {r.map(([n, t], k) => (
            <Reveal key={n} delay={k * 100}>
              <div className="card h-full p-7">
                <div className="flex gap-1 text-sun-500">{Array.from({ length: 5 }).map((_, x) => <Star key={x} size={18} className="fill-current" />)}</div>
                <p className="mt-4 text-ink-900/75">“{t}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-600 font-bold text-white">{n[0]}</div>
                  <div className="font-semibold">{n}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  const { settings } = useData()
  return (
    <section className="px-4 pb-20 sm:pb-28">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-sun-400 to-sun-500 p-8 sm:p-14">
          <div className="absolute -right-10 -top-10 h-60 w-60 rounded-full bg-white/30 blur-2xl" />
          <div className="relative flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
            <div>
              <h2 className="font-display text-4xl text-ink-900 sm:text-6xl">Hungry? Order now!</h2>
              <p className="mt-2 text-ink-900/70">Call or WhatsApp us – we are ready.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link to="/menu" className="btn bg-ink-900 text-white hover:bg-brand-600">Order Now</Link>
              <a href={waLink(settings.whatsapp, 'Hello! I would like to place an order.')} target="_blank" rel="noreferrer" className="btn bg-emerald-600 text-white hover:bg-emerald-500"><MessageCircle size={18} /> WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <Famous />
      <MenuPreview />
      <DealsSection />
      <Why />
      <Steps />
      <Reviews />
      <CTA />
    </>
  )
}
