import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { useData } from '../context/DataContext'
import ItemCard from '../components/ItemCard'
import Reveal from '../components/Reveal'
import PageHero from '../components/PageHero'

export default function Menu() {
  const { categories, items } = useData()
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  const cats = categories.filter((c) => items.some((i) => i.category === c.id))
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase()
    return items.filter((i) => (cat === 'all' || i.category === cat) && (!s || i.name.toLowerCase().includes(s)))
  }, [items, cat, q])

  const groups = cats.map((c) => ({ c, list: filtered.filter((i) => i.category === c.id) })).filter((g) => g.list.length)

  return (
    <>
      <PageHero title="Our Menu" sub="Choose your favorites, add them to the cart and place your order." />
      <section className="py-12 sm:py-16">
        <div className="container-x">
          <div className="sticky top-[68px] z-30 -mx-4 mb-10 bg-cream/95 px-4 py-3 backdrop-blur sm:top-[76px] sm:mx-0 sm:rounded-3xl sm:px-4 sm:shadow-card sm:ring-1 sm:ring-black/5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center">
              <div className="no-scrollbar flex flex-1 gap-2 overflow-x-auto">
                {[{ id: 'all', name: 'All', emoji: '✨' }, ...cats].map((c) => (
                  <button key={c.id} onClick={() => setCat(c.id)}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-bold transition ${cat === c.id ? 'bg-brand-600 text-white shadow-glow' : 'bg-white text-ink-900 ring-1 ring-black/10 hover:bg-brand-100'}`}>
                    {c.emoji} {c.name}
                  </button>
                ))}
              </div>
              <div className="relative md:w-64">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-900/40" />
                <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search items..." className="input !rounded-full !py-2.5 pl-10" />
              </div>
            </div>
          </div>

          {groups.length === 0 && <p className="py-20 text-center text-ink-900/50">No items found.</p>}

          {groups.map(({ c, list }) => (
            <div key={c.id} className="mb-16">
              <Reveal>
                <div className="mb-6 flex items-end gap-4 border-b-2 border-dashed border-brand-600/25 pb-3">
                  <span className="text-4xl">{c.emoji}</span>
                  <h2 className="font-display text-4xl text-ink-900 sm:text-5xl">{c.name}</h2>
                </div>
              </Reveal>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {list.map((it, k) => <Reveal key={it.id} delay={(k % 4) * 70}><ItemCard item={it} /></Reveal>)}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
