import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const Ctx = createContext(null)
export const useCart = () => useContext(Ctx)

const load = () => { try { return JSON.parse(localStorage.getItem('ff_cart')) || [] } catch { return [] } }

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load)
  const [toast, setToast] = useState(null)

  useEffect(() => { try { localStorage.setItem('ff_cart', JSON.stringify(lines)) } catch { /* ignore */ } }, [lines])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 1800)
    return () => clearTimeout(t)
  }, [toast])

  const api = useMemo(() => ({
    lines,
    toast,
    count: lines.reduce((s, l) => s + l.qty, 0),
    subtotal: lines.reduce((s, l) => s + l.qty * l.price, 0),
    add(line) {
      setLines((cur) => {
        const i = cur.findIndex((l) => l.key === line.key)
        if (i >= 0) return cur.map((l, j) => (j === i ? { ...l, qty: l.qty + (line.qty || 1) } : l))
        return [...cur, { ...line, qty: line.qty || 1 }]
      })
      setToast(`${line.name}${line.variant ? ` (${line.variant})` : ''} added to cart`)
    },
    setQty(key, qty) {
      setLines((cur) => (qty <= 0 ? cur.filter((l) => l.key !== key) : cur.map((l) => (l.key === key ? { ...l, qty } : l))))
    },
    remove: (key) => setLines((cur) => cur.filter((l) => l.key !== key)),
    clear: () => setLines([]),
  }), [lines, toast])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}
