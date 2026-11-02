import { useMemo, useState } from 'react'
import { Plus, Pencil, Trash2, Search, Flame, Star } from 'lucide-react'
import { useData } from '../../context/DataContext'
import { db } from '../../lib/db'
import { money, slug } from '../../lib/utils'
import FoodImage from '../../components/FoodImage'
import { CAT_FALLBACK } from '../../data/images'
import { Field, ImageInput, Modal, Toggle } from './AdminUI'

const blank = (cat) => ({ name: '', urdu: '', category: cat, desc: '', image: '', variants: [{ label: 'Regular', price: 0 }], popular: false, available: true })

export default function MenuManager() {
  const { items, categories } = useData()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [edit, setEdit] = useState(null)

  const list = useMemo(() => items.filter((i) => (cat === 'all' || i.category === cat) && i.name.toLowerCase().includes(q.toLowerCase())), [items, cat, q])

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="font-display text-5xl">Menu Items</h1><p className="text-sm text-ink-900/55">{items.length} items – edit prices, images and sizes here.</p></div>
        <button onClick={() => setEdit(blank(categories[0]?.id))} className="btn-primary"><Plus size={18} /> New Item</button>
      </div>

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <div className="relative flex-1"><Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" /><input className="input pl-10" placeholder="Search items..." value={q} onChange={(e) => setQ(e.target.value)} /></div>
        <select className="input md:w-60" value={cat} onChange={(e) => setCat(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
        </select>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {list.map((it) => (
          <div key={it.id} className={`flex gap-4 rounded-3xl bg-white p-4 shadow-card ${it.available === false ? 'opacity-60' : ''}`}>
            <FoodImage src={it.image || CAT_FALLBACK[it.category]} alt={it.name} emoji={categories.find((c) => c.id === it.category)?.emoji} className="h-24 w-24 shrink-0 rounded-2xl" />
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <div className="truncate font-bold">{it.name}</div>
                {it.popular && <Flame size={16} className="shrink-0 text-brand-600" />}
              </div>
              <div className="text-xs text-ink-900/50">{categories.find((c) => c.id === it.category)?.name}</div>
              <div className="mt-1 flex flex-wrap gap-1">
                {it.variants.map((v) => <span key={v.label} className="rounded-full bg-cream px-2 py-0.5 text-[11px] font-semibold">{v.label}: {money(v.price)}</span>)}
              </div>
              <div className="mt-3 flex items-center gap-2">
                <button onClick={() => setEdit(it)} className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3 py-1.5 text-xs font-bold text-white"><Pencil size={12} /> Edit</button>
                <button onClick={() => db.save('items', it.id, { available: it.available === false })} className={`rounded-full px-3 py-1.5 text-xs font-bold ${it.available === false ? 'bg-emerald-100 text-emerald-700' : 'bg-black/5'}`}>{it.available === false ? 'Back in stock' : 'Sold out'}</button>
                <button onClick={() => confirm(`Delete "${it.name}"?`) && db.remove('items', it.id)} className="ml-auto text-ink-900/30 hover:text-brand-600"><Trash2 size={17} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="py-16 text-center text-ink-900/50">No items found.</p>}
      {edit && <ItemForm initial={edit} onClose={() => setEdit(null)} />}
    </div>
  )
}

function ItemForm({ initial, onClose }) {
  const { categories, items } = useData()
  const isNew = !initial.id
  const [f, setF] = useState(initial)
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }))
  const setVar = (i, k, v) => set('variants', f.variants.map((x, j) => (j === i ? { ...x, [k]: k === 'price' ? Number(v) : v } : x)))

  const save = async (e) => {
    e.preventDefault()
    const id = f.id || `${slug(f.name)}-${Date.now().toString(36).slice(-4)}`
    const order = f.order ?? Math.max(0, ...items.map((i) => i.order || 0)) + 1
    await db.save('items', id, { ...f, id, order, variants: f.variants.filter((v) => v.label.trim()) })
    onClose()
  }

  return (
    <Modal title={isNew ? 'New Item' : 'Edit Item'} onClose={onClose} wide>
      <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
        <Field label="Item name *"><input required className="input" value={f.name} onChange={(e) => set('name', e.target.value)} /></Field>
        <Field label="Category *">
          <select required className="input" value={f.category} onChange={(e) => set('category', e.target.value)}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.emoji} {c.name}</option>)}
          </select>
        </Field>
        <Field label="Sort order (lower first)"><input type="number" className="input" value={f.order ?? ''} placeholder="auto" onChange={(e) => set('order', e.target.value === '' ? undefined : Number(e.target.value))} /></Field>
        <Field label="Description" className="sm:col-span-2"><textarea rows={2} className="input resize-none" value={f.desc || ''} onChange={(e) => set('desc', e.target.value)} /></Field>
        <Field label="Image" className="sm:col-span-2"><ImageInput value={f.image} onChange={(v) => set('image', v)} /></Field>

        <div className="sm:col-span-2">
          <label className="label">Sizes & Prices</label>
          <div className="space-y-2">
            {f.variants.map((v, i) => (
              <div key={i} className="flex gap-2">
                <input className="input" placeholder="Size (e.g. Small, Large, 6 Pcs)" value={v.label} onChange={(e) => setVar(i, 'label', e.target.value)} />
                <input type="number" min="0" className="input w-36" placeholder="Rs" value={v.price} onChange={(e) => setVar(i, 'price', e.target.value)} />
                {f.variants.length > 1 && <button type="button" onClick={() => set('variants', f.variants.filter((_, j) => j !== i))} className="px-2 text-ink-900/40 hover:text-brand-600"><Trash2 size={18} /></button>}
              </div>
            ))}
          </div>
          <button type="button" onClick={() => set('variants', [...f.variants, { label: '', price: 0 }])} className="mt-2 text-sm font-bold text-brand-600">+ Add another size</button>
        </div>

        <div className="flex flex-wrap gap-8 sm:col-span-2">
          <Toggle checked={!!f.popular} onChange={(v) => set('popular', v)} label="Famous item (shown on home page)" />
          <Toggle checked={f.available !== false} onChange={(v) => set('available', v)} label="Available" />
        </div>
        <div className="flex justify-end gap-3 sm:col-span-2">
          <button type="button" onClick={onClose} className="btn border-2 border-ink-900/15">Cancel</button>
          <button className="btn-primary">Save</button>
        </div>
      </form>
    </Modal>
  )
}
