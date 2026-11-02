// Ek hi interface: agar Firebase set hai to Firestore (live, sab devices par),
// warna browser ka localStorage (demo mode).
import { collection, onSnapshot, doc, setDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { fs, hasFirebase } from './firebase'

const KEY = (c) => `ff_${c}`
const listeners = {}

function readLocal(c) {
  try { return JSON.parse(localStorage.getItem(KEY(c))) || [] } catch { return [] }
}
function writeLocal(c, arr) {
  localStorage.setItem(KEY(c), JSON.stringify(arr))
  ;(listeners[c] || []).forEach((cb) => cb(arr))
}

export const db = {
  subscribe(c, cb) {
    if (hasFirebase) {
      return onSnapshot(
        collection(fs, c),
        (snap) => cb(snap.docs.map((d) => ({ ...d.data(), id: d.id }))),
        (err) => { console.warn(`[db] ${c}:`, err.code); cb([]) },
      )
    }
    listeners[c] = listeners[c] || []
    listeners[c].push(cb)
    cb(readLocal(c))
    const onStorage = (e) => { if (e.key === KEY(c)) cb(readLocal(c)) }
    window.addEventListener('storage', onStorage)
    return () => {
      listeners[c] = listeners[c].filter((x) => x !== cb)
      window.removeEventListener('storage', onStorage)
    }
  },
  async save(c, id, data) {
    const clean = JSON.parse(JSON.stringify(data))
    delete clean.id
    if (hasFirebase) return setDoc(doc(fs, c, id), clean, { merge: true })
    const arr = readLocal(c)
    const i = arr.findIndex((x) => x.id === id)
    if (i >= 0) arr[i] = { ...arr[i], ...clean, id }
    else arr.push({ ...clean, id })
    writeLocal(c, arr)
  },
  async add(c, data) {
    const clean = JSON.parse(JSON.stringify(data))
    if (hasFirebase) { const r = await addDoc(collection(fs, c), clean); return r.id }
    const id = 'l' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
    const arr = readLocal(c)
    arr.push({ ...clean, id })
    writeLocal(c, arr)
    return id
  },
  async remove(c, id) {
    if (hasFirebase) return deleteDoc(doc(fs, c, id))
    writeLocal(c, readLocal(c).filter((x) => x.id !== id))
  },
}
