import { Link } from 'react-router-dom'
import { Heart, Leaf, Award, Users, MapPin, Clock, Phone } from 'lucide-react'
import { useData } from '../context/DataContext'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import SectionTitle from '../components/SectionTitle'
import FoodImage from '../components/FoodImage'
import { IMG } from '../data/images'

export default function About() {
  const { settings: s } = useData()
  const vals = [
    [Heart, 'Made with love', 'Every item is prepared by hand with love and care.'],
    [Leaf, 'Fresh ingredients', 'Fresh vegetables and chicken every day – no shortcuts.'],
    [Award, 'Great taste', 'The taste that keeps you coming back.'],
    [Users, 'You come first', 'Our customers are our top priority.'],
  ]
  return (
    <>
      <PageHero kicker="Our story" title="About Us" sub={`${s.name} – where every bite is a joy.`} />

      <section className="py-16 sm:py-24">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative">
              <div className="absolute -inset-3 rotate-2 rounded-[2rem] bg-brand-600/15" />
              <FoodImage src={IMG.burger} alt="Burger" className="relative aspect-[4/3] w-full rounded-[2rem] shadow-2xl" />
              <div className="absolute -bottom-6 -right-2 flex items-center gap-3 rounded-2xl bg-white p-4 shadow-2xl sm:-right-6">
                <img src="/logo.png" alt="" className="h-14 w-14 rounded-full" />
                <div><div className="font-display text-2xl leading-none">{s.name}</div><div className="text-xs text-ink-900/60">Since day one, same taste</div></div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <span className="rounded-full bg-brand-100 px-4 py-1 text-xs font-bold uppercase tracking-[.2em] text-brand-700">Who we are</span>
            <h2 className="mt-4 font-display text-5xl sm:text-6xl">A small shop with big flavor</h2>
            <p className="mt-5 leading-relaxed text-ink-900/70">
              {s.name} {s.tagline} started with a simple dream: to serve clean, fresh and delicious fast food at fair prices. Our zinger burgers, loaded shawarma, crispy wings and tangy chaat have become a neighborhood favorite.
            </p>
            <p className="mt-4 leading-relaxed text-ink-900/70">
              We make every order fresh so it reaches you hot and crispy. Whether you are eating alone, with friends or with the whole family, we have a deal for every occasion.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4">
              {[['30+', 'Menu items'], ['6', 'Hot deals'], ['1000+', 'Happy customers']].map(([a, b]) => (
                <div key={b} className="rounded-2xl bg-white p-4 text-center shadow-card">
                  <div className="font-display text-4xl text-brand-600">{a}</div>
                  <div className="text-xs text-ink-900/60">{b}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="container-x">
          <SectionTitle kicker="Our values" title="What We Believe In" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {vals.map(([Icon, t, d], k) => (
              <Reveal key={t} delay={k * 90}>
                <div className="h-full rounded-3xl bg-cream p-7 text-center transition hover:-translate-y-1.5 hover:shadow-card">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-600 text-white"><Icon size={28} /></div>
                  <h3 className="mt-4 font-display text-2xl">{t}</h3>
                  <p className="mt-2 text-sm text-ink-900/60">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="container-x">
          <SectionTitle kicker="Find us" title="Our Location" />
          <div className="grid overflow-hidden rounded-[2rem] bg-white shadow-card lg:grid-cols-5">
            <div className="space-y-6 bg-ink-950 p-8 text-white lg:col-span-2">
              {[[MapPin, 'Address', s.address], [Clock, 'Timing', s.hours], [Phone, 'Phone', s.phone]].map(([Icon, t, d]) => (
                <div key={t} className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-600"><Icon size={22} /></div>
                  <div><div className="font-display text-xl text-sun-400">{t}</div><div className="text-white/75">{d}</div></div>
                </div>
              ))}
              <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(s.mapQuery)}`} target="_blank" rel="noreferrer" className="btn-sun w-full">Get Directions</a>
            </div>
            <iframe title="Location" className="h-80 w-full border-0 lg:col-span-3 lg:h-full lg:min-h-[26rem]" loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(s.mapQuery)}&output=embed`} />
          </div>
          <div className="mt-10 text-center"><Link to="/menu" className="btn-primary">View Menu</Link></div>
        </div>
      </section>
    </>
  )
}
