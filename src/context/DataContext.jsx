import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { db } from '../lib/db'
import { DATA_VERSION, DEFAULT_CATEGORIES, DEFAULT_DEALS, DEFAULT_ITEMS, DEFAULT_SETTINGS } from '../data/defaults'

const Ctx = createContext(null)
export const useData = () => useContext(Ctx)

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999)

export function DataProvider({ children }) {
  const [raw, setRaw] = useState({ categories: null, items: null, deals: null, settings: null })

  useEffect(() => {
    const subs = ['categories', 'items', 'deals', 'settings'].map((c) =>
      db.subscribe(c, (arr) => setRaw((r) => ({ ...r, [c]: arr }))),
    )
    return () => subs.forEach((u) => u())
  }, [])

  const value = useMemo(() => {
    const settingsDoc = (raw.settings || []).find((s) => s.id === 'main')
    const seeded = Boolean(settingsDoc) && settingsDoc.dataVersion === DATA_VERSION // once the admin has saved the menu, the database is the source of truth
    const pick = (k, def) => (seeded ? raw[k] || [] : def)
    return {
      loading: Object.values(raw).some((v) => v === null),
      categories: [...pick('categories', DEFAULT_CATEGORIES)].sort(byOrder),
      items: [...pick('items', DEFAULT_ITEMS)].sort(byOrder),
      deals: [...pick('deals', DEFAULT_DEALS)].sort(byOrder),
      settings: seeded ? { ...DEFAULT_SETTINGS, ...settingsDoc } : DEFAULT_SETTINGS,
      seeded,
    }
  }, [raw])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// On admin login, saves the default menu into an empty (or outdated) database
export async function seedDefaults(data) {
  const jobs = []
  DEFAULT_CATEGORIES.forEach((c) => jobs.push(db.save('categories', c.id, c)))
  DEFAULT_ITEMS.forEach((i) => jobs.push(db.save('items', i.id, i)))
  DEFAULT_DEALS.forEach((d) => jobs.push(db.save('deals', d.id, d)))
  jobs.push(db.save('settings', 'main', DEFAULT_SETTINGS))
  await Promise.all(jobs)
}
