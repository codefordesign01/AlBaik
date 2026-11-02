import { useState } from 'react'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { db } from '../../lib/db'
import { money, slug } from '../../lib/utils'
import FoodImage from '../../components/FoodImage'
import { Field, ImageInput, Modal, Toggle } from './AdminUI'

const blank = { title: '', badge: 'HOT', desc: '', items: [], price: 0, oldPrice: 0, image: '', active: true }

export default function DealsManager() {
  const { deals } = useData()
  const [edit, setEdit] = useState(null)
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-5xl">Deals</h1><p className="text-sm text-ink-900/55">Create your own deals, e.g. "2 burgers + 1 cold drink free".</p></div>
        <button onClick={() => setEdit(blank)} className="btn-primary"><Plus size={18} /> New Deal</button>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {deals.map((d) => (
          <div key={d.id} className={`overflow-hidden rounded-3xl bg-white shadow-card ${d.active === false ? 'opacity-60' : ''}`}>
            <FoodImage src={d.image} alt={d.title} emoji="🎁" className="h-40 w-full" />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2"><h3 className="font-display text-2xl">{d.title}</h3>{d.badge && <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-bold text-brand-700">{d.badge}</span>}</div>
              <ul className="mt-2 list-inside list-disc text-sm text-ink-900/65">{(d.items || []).map((i) => <li key={i}>{i}</li>)}</ul>
              <div className="mt-3 flex items-baseline gap-2"><b className="font-display text-3xl text-brand-600">{money(d.price)}</b>{d.oldPrice > d.price && <s className="text-sm text-ink-900/40">{money(d.oldPrice)}</s>}</div>
              <div className="mt-4 flex items-center gap-2">
                <button onClick={() => setEdit(d)} className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-bold text-white"><Pencil size={12} /> Edit</button>
                <button onClick={() => db.save('deals', d.id, { active: d.active === false })} className={`rounded-full px-3 py-1.5 text-xs font-bold ${d.active === false ? 'bg-emerald-100 text-emerald-700' : 'bg-black/5'}`}>{d.active === false ? 'Show' : 'Hide'}</button>
                <button onClick={() => confirm(`Delete "${d.title}"?`) && db.remove('deals', d.id)} className="ml-auto text-ink-900/30 hover:text-brand-600"><Trash2 size={17} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {deals.length === 0 && <p className="py-16 text-center text-ink-900/50">No deals yet. Click "New Deal".</p>}
      {edit && <DealForm initial={edit} onClose={() => setEdit(null)} />}
    </div>
  )
}

function DealForm({ initial, onClose }) {
  const { deals } = useData()
  const [f, setF] = useState({ ...initial, itemsText: (initial.items || []).join('\n') })
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const save = async (e) => {
    e.preventDefault()
    const id = f.id || `${slug(f.title)}-${Date.now().toString(36).slice(-4)}`
    const { itemsText, ...rest } = f
    await db.save('deals', id, {
      ...rest, id, price: Number(f.price), oldPrice: Number(f.oldPrice) || 0,
      items: itemsText.split('\n').map((s) => s.trim()).filter(Boolean),
      order: f.order ?? Math.max(0, ...deals.map((d) => d.order || 0)) + 1,
    })
    onClose()
  }
  return (
    <Modal title={f.id ? 'Edit Deal' : 'New Deal'} onClose={onClose} wide>
      <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
        <Field label="Deal name *"><input required className="input" value={f.title} onChange={(e) => set('title', e.target.value)} placeholder="Double Burger Deal" /></Field>
        <Field label="Badge (small label)"><input className="input" value={f.badge || ''} onChange={(e) => set('badge', e.target.value)} placeholder="HOT / BEST SELLER" /></Field>
        <Field label="Short description" className="sm:col-span-2"><input className="input" value={f.desc || ''} onChange={(e) => set('desc', e.target.value)} placeholder="2 burgers with 1 cold drink free" /></Field>
        <Field label="Deal contents (one item per line)" hint='Lines containing "FREE" are shown with a gift icon.' className="sm:col-span-2">
          <textarea rows={5} className="input resize-none" value={f.itemsText} onChange={(e) => set('itemsText', e.target.value)} placeholder={'2 x Zinger Burger\n1.5L Cold Drink FREE'} />
        </Field>
        <Field label="Deal price (Rs) *"><input required type="number" min="0" className="input" value={f.price} onChange={(e) => set('price', e.target.value)} /></Field>
        <Field label="Old price (Rs) – shown crossed out"><input type="number" min="0" className="input" value={f.oldPrice} onChange={(e) => set('oldPrice', e.target.value)} /></Field>
        <Field label="Image" className="sm:col-span-2"><ImageInput value={f.image} onChange={(v) => set('image', v)} /></Field>
        <div className="sm:col-span-2"><Toggle checked={f.active !== false} onChange={(v) => set('active', v)} label="Show on website" /></div>
        <div className="flex justify-end gap-3 sm:col-span-2"><button type="button" onClick={onClose} className="btn border-2 border-ink-900/15">Cancel</button><button className="btn-primary">Save</button></div>
      </form>
    </Modal>
  )
}
