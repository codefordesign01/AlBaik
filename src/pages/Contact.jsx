import { useState } from 'react'
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from 'lucide-react'
import { useData } from '../context/DataContext'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'
import { waLink } from '../lib/whatsapp'

export default function Contact() {
  const { settings: s } = useData()
  const [f, setF] = useState({ name: '', phone: '', message: '' })
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const text = `📩 *New Message (Website Contact)*\n\n👤 Name: ${f.name}\n📞 Phone: ${f.phone}\n\n💬 ${f.message}`
    window.open(waLink(s.whatsapp, text), '_blank')
    setF({ name: '', phone: '', message: '' })
  }

  const info = [
    [Phone, 'Order / Call', s.phone, `tel:${s.phone.replace(/\s/g, '')}`],
    [MessageCircle, 'WhatsApp', `+${s.whatsapp}`, waLink(s.whatsapp, 'Hello!')],
    [Mail, 'Email', s.email, `mailto:${s.email}`],
    [MapPin, 'Address', s.address, null],
    [Clock, 'Timing', s.hours, null],
  ]

  return (
    <>
      <PageHero kicker="Get in touch" title="Contact Us" sub="Questions, feedback or bulk orders – we are happy to help." />
      <section className="py-14 sm:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <div className="h-full space-y-4">
              <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-7 text-white shadow-glow">
                <div className="text-xs font-bold uppercase tracking-[.2em] text-sun-400">Order number</div>
                <a href={`tel:${s.phone.replace(/\s/g, '')}`} className="mt-1 block font-display text-5xl sm:text-6xl">{s.phone}</a>
                <p className="mt-1 text-sm text-white/75">Call or WhatsApp to order</p>
              </div>
              {info.map(([Icon, t, d, href]) => {
                const inner = (
                  <div className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-card transition hover:-translate-y-0.5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-600"><Icon size={22} /></div>
                    <div><div className="text-xs font-bold uppercase tracking-wider text-ink-900/45">{t}</div><div className="font-semibold">{d}</div></div>
                  </div>
                )
                return href ? <a key={t} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block">{inner}</a> : <div key={t}>{inner}</div>
              })}
            </div>
          </Reveal>

          <Reveal delay={100} className="lg:col-span-3">
            <form onSubmit={submit} className="card p-6 sm:p-9">
              <h2 className="font-display text-4xl sm:text-5xl">Send us a message</h2>
              <p className="mt-1 text-sm text-ink-900/60">Your message goes straight to our WhatsApp once you submit.</p>
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div><label className="label">Your name</label><input required className="input" value={f.name} onChange={set('name')} placeholder="Ahmed Ali" /></div>
                <div><label className="label">Phone number</label><input required type="tel" className="input" value={f.phone} onChange={set('phone')} placeholder="03XX XXXXXXX" /></div>
                <div className="sm:col-span-2"><label className="label">Message</label><textarea required rows={5} className="input resize-none" value={f.message} onChange={set('message')} placeholder="Write your message..." /></div>
              </div>
              <button className="btn-primary mt-6 w-full sm:w-auto"><Send size={18} /> Send via WhatsApp</button>
            </form>
          </Reveal>
        </div>
      </section>
    </>
  )
}
