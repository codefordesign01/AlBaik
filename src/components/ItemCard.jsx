import { useState } from 'react'
import { Plus, Flame, Check } from 'lucide-react'
import FoodImage from './FoodImage'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { money } from '../lib/utils'
import { CAT_FALLBACK } from '../data/images'

export default function ItemCard({ item }) {
  const { add } = useCart()
  const { categories } = useData()
  const [vi, setVi] = useState(0)
  const [done, setDone] = useState(false)
  const variants = item.variants?.length ? item.variants : [{ label: 'Regular', price: 0 }]
  const cur = variants[Math.min(vi, variants.length - 1)]
  const cat = categories.find((c) => c.id === item.category)
  const off = item.available === false

  const onAdd = () => {
    add({
      key: `${item.id}|${cur.label}`, type: 'item', itemId: item.id, name: item.name,
      variant: variants.length > 1 || cur.label !== 'Regular' ? cur.label : '', price: cur.price,
      image: item.image || CAT_FALLBACK[item.category],
    })
    setDone(true)
    setTimeout(() => setDone(false), 1100)
  }

  return (
    <article className={`group card flex h-full flex-col overflow-hidden transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${off ? 'opacity-70' : ''}`}>
      <div className="relative aspect-[4/3] overflow-hidden">
        <FoodImage src={item.image || CAT_FALLBACK[item.category]} alt={item.name} emoji={cat?.emoji}
          className="h-full w-full transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        {item.popular && (
          <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-sun-500 px-3 py-1 text-xs font-bold text-ink-900 shadow">
            <Flame size={13} /> Popular
          </span>
        )}
        {off && <span className="absolute inset-0 flex items-center justify-center bg-black/55 font-display text-3xl text-white">Sold Out</span>}
        <span className="absolute bottom-3 right-3 rounded-full bg-white px-3 py-1 text-sm font-extrabold text-brand-700 shadow-lg">{money(cur.price)}</span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-2xl leading-tight text-ink-900">{item.name}</h3>
        </div>
        {item.desc && <p className="mt-1 line-clamp-2 text-sm text-ink-900/60">{item.desc}</p>}

        {variants.length > 1 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {variants.map((v, i) => (
              <button key={v.label} onClick={() => setVi(i)}
                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${i === vi ? 'border-brand-600 bg-brand-600 text-white' : 'border-ink-900/15 text-ink-900/70 hover:border-brand-600'}`}>
                {v.label}
              </button>
            ))}
          </div>
        )}

        <button onClick={onAdd} disabled={off}
          className={`mt-auto pt-0`}>
          <span className={`mt-5 flex w-full items-center justify-center gap-2 rounded-full py-3 text-sm font-bold transition ${done ? 'bg-emerald-500 text-white' : 'bg-ink-900 text-white group-hover:bg-brand-600'}`}>
            {done ? <><Check size={18} /> Added</> : <><Plus size={18} /> Add to Cart</>}
          </span>
        </button>
      </div>
    </article>
  )
}
