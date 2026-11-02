import { useNavigate } from 'react-router-dom'
import { ShoppingBag, Check, Gift } from 'lucide-react'
import FoodImage from './FoodImage'
import { useCart } from '../context/CartContext'
import { money } from '../lib/utils'

export default function DealCard({ deal, dark = false }) {
  const { add } = useCart()
  const nav = useNavigate()
  const save = deal.oldPrice > deal.price ? deal.oldPrice - deal.price : 0

  const order = () => {
    add({ key: `deal|${deal.id}`, type: 'deal', itemId: deal.id, name: deal.title, variant: 'Deal', price: deal.price, image: deal.image })
    nav('/order')
  }

  return (
    <article className={`group relative flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1.5 ${dark ? 'bg-white/[.07] ring-1 ring-white/15 backdrop-blur' : 'bg-white shadow-card hover:shadow-2xl'}`}>
      <div className="relative aspect-[16/10] overflow-hidden">
        <FoodImage src={deal.image} alt={deal.title} emoji="🎁" className="h-full w-full transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        {deal.badge && <span className="absolute left-4 top-4 rounded-full bg-brand-600 px-3 py-1 text-xs font-extrabold tracking-wider text-white shadow-lg">{deal.badge}</span>}
        {save > 0 && <span className="absolute right-4 top-4 rounded-full bg-sun-500 px-3 py-1 text-xs font-extrabold text-ink-900 shadow-lg">SAVE {money(save)}</span>}
        <h3 className="absolute bottom-3 left-4 right-4 font-display text-3xl text-white drop-shadow">{deal.title}</h3>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className={`text-sm ${dark ? 'text-white/70' : 'text-ink-900/60'}`}>{deal.desc}</p>
        <ul className="mt-3 space-y-1.5">
          {(deal.items || []).map((it) => {
            const free = /free/i.test(it)
            return (
              <li key={it} className={`flex items-center gap-2 text-sm font-medium ${dark ? 'text-white' : 'text-ink-900'}`}>
                {free ? <Gift size={16} className="shrink-0 text-sun-500" /> : <Check size={16} className="shrink-0 text-emerald-500" />}
                <span className={free ? 'font-bold text-brand-600' : ''}>{it}</span>
              </li>
            )
          })}
        </ul>
        <div className="mt-auto flex items-end justify-between gap-3 pt-5">
          <div>
            {deal.oldPrice > deal.price && <div className={`text-sm line-through ${dark ? 'text-white/50' : 'text-ink-900/40'}`}>{money(deal.oldPrice)}</div>}
            <div className={`font-display text-4xl leading-none ${dark ? 'text-sun-400' : 'text-brand-600'}`}>{money(deal.price)}</div>
          </div>
          <button onClick={order} className="btn-primary !px-5 !py-2.5 text-sm"><ShoppingBag size={17} /> Order Now</button>
        </div>
      </div>
    </article>
  )
}
