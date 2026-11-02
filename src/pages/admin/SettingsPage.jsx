import { useState } from 'react'
import { Check, RotateCcw } from 'lucide-react'
import { useData, seedDefaults } from '../../context/DataContext'
import { db } from '../../lib/db'
import { Field } from './AdminUI'

export default function SettingsPage() {
  const data = useData()
  const [f, setF] = useState(data.settings)
  const [ok, setOk] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const save = async (e) => {
    e.preventDefault()
    await db.save('settings', 'main', { ...f, id: 'main', deliveryFee: Number(f.deliveryFee) || 0, minOrder: Number(f.minOrder) || 0 })
    setOk(true); setTimeout(() => setOk(false), 2000)
  }
  const reset = async () => {
    if (!confirm('This will restore the menu, categories and deals to defaults. Your changes will be lost. Continue?')) return
    await Promise.all([...data.items.map((i) => db.remove('items', i.id)), ...data.deals.map((d) => db.remove('deals', d.id)), ...data.categories.map((c) => db.remove('categories', c.id))])
    await seedDefaults(data)
    alert('Default menu restored.')
  }

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-5xl">Settings</h1>
      <p className="mb-6 text-sm text-ink-900/55">Shop information – shown across the whole website.</p>
      <form onSubmit={save} className="space-y-6">
        <div className="card grid gap-5 p-6 sm:grid-cols-2">
          <h2 className="font-display text-3xl sm:col-span-2">Shop</h2>
          <Field label="Shop name"><input className="input" value={f.name} onChange={set('name')} /></Field>
          <Field label="Tagline"><input className="input" value={f.tagline} onChange={set('tagline')} /></Field>
          <Field label="Order WhatsApp number *" hint="Include the country code, e.g. 923001234567. Orders arrive on this number."><input required className="input" value={f.whatsapp} onChange={set('whatsapp')} /></Field>
          <Field label="Call / Order number"><input className="input" value={f.phone} onChange={set('phone')} /></Field>
          <Field label="Email"><input className="input" value={f.email} onChange={set('email')} /></Field>
          <Field label="Timing"><input className="input" value={f.hours} onChange={set('hours')} /></Field>
          <Field label="Address" className="sm:col-span-2"><input className="input" value={f.address} onChange={set('address')} /></Field>
          <Field label="Map location" hint='Type it like Google Maps, e.g. "Al Baik Fast Food, Main Market, Lahore".' className="sm:col-span-2"><input className="input" value={f.mapQuery} onChange={set('mapQuery')} /></Field>
        </div>
        <div className="card grid gap-5 p-6 sm:grid-cols-2">
          <h2 className="font-display text-3xl sm:col-span-2">Delivery</h2>
          <Field label="Delivery charges (Rs)"><input type="number" min="0" className="input" value={f.deliveryFee} onChange={set('deliveryFee')} /></Field>
          <Field label="Minimum order (Rs)" hint="0 = no minimum"><input type="number" min="0" className="input" value={f.minOrder} onChange={set('minOrder')} /></Field>
        </div>
        <div className="card grid gap-5 p-6 sm:grid-cols-2">
          <h2 className="font-display text-3xl sm:col-span-2">Home page</h2>
          <Field label="Banner heading" className="sm:col-span-2"><input className="input" value={f.heroTitle} onChange={set('heroTitle')} /></Field>
          <Field label="Banner subtext" className="sm:col-span-2"><textarea rows={2} className="input resize-none" value={f.heroSub} onChange={set('heroSub')} /></Field>
          <Field label="Facebook link"><input className="input" value={f.facebook} onChange={set('facebook')} /></Field>
          <Field label="Instagram link"><input className="input" value={f.instagram} onChange={set('instagram')} /></Field>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <button className="btn-primary">{ok ? <><Check size={18} /> Saved</> : 'Save settings'}</button>
          <button type="button" onClick={reset} className="inline-flex items-center gap-2 text-sm font-semibold text-ink-900/50 hover:text-brand-600"><RotateCcw size={15} /> Restore default menu</button>
        </div>
      </form>
    </div>
  )
}
