import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const env = import.meta.env
const cfg = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

export const hasFirebase = Boolean(cfg.apiKey && cfg.projectId)

let app, fs, auth
if (hasFirebase) {
  app = initializeApp(cfg)
  fs = getFirestore(app)
  auth = getAuth(app)
}
export { fs, auth }
