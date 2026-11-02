import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, ArrowRight, CheckCircle2 } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { money } from '../lib/utils'

export default function CartBar() {
  const { count, subtotal, toast } = useCart()
  const { pathname } = useLocation()
  const hide = pathname.startsWith('/order') || pathname.startsWith('/admin')
  if (hide) return null
  return (
    <>
      {toast && (
        <div className="fixed left-1/2 top-24 z-[70] -translate-x-1/2 animate-pop">
          <div className="flex items-center gap-2 rounded-full bg-ink-900 px-5 py-3 text-sm font-semibold text-white shadow-2xl">
            <CheckCircle2 size={18} className="text-emerald-400" /> {toast}
          </div>
        </div>
      )}
      {count > 0 && (
        <Link to="/order" className="fixed inset-x-4 bottom-4 z-40 mx-auto flex max-w-xl animate-slideUp items-center justify-between rounded-full bg-brand-600 px-5 py-3.5 text-white shadow-glow transition hover:bg-brand-700">
          <span className="flex items-center gap-3 font-semibold">
            <span className="relative"><ShoppingBag size={22} /><span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-sun-500 px-1 text-[11px] font-bold text-ink-900">{count}</span></span>
            View cart
          </span>
          <span className="flex items-center gap-2 font-bold">{money(subtotal)} <ArrowRight size={18} /></span>
        </Link>
      )}
    </>
  )
}
