import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { auth, hasFirebase } from '../lib/firebase'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const DEMO_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (hasFirebase) {
      return onAuthStateChanged(auth, (u) => { setUser(u); setLoading(false) })
    }
    setUser(sessionStorage.getItem('ff_admin') ? { email: 'admin' } : null)
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    if (hasFirebase) {
      await signInWithEmailAndPassword(auth, email, password)
      return
    }
    if (password !== DEMO_PASS) throw new Error('Incorrect password')
    sessionStorage.setItem('ff_admin', '1')
    setUser({ email: 'admin' })
  }
  const logout = async () => {
    if (hasFirebase) await signOut(auth)
    sessionStorage.removeItem('ff_admin')
    setUser(null)
  }

  return <Ctx.Provider value={{ user, loading, login, logout, demo: !hasFirebase }}>{children}</Ctx.Provider>
}
