# Al Baik Fast Food - Website + Admin Dashboard

React + Vite + Tailwind CSS. Pages: Home, Menu, Deals, About, Contact, Order (checkout) aur `/admin` dashboard.

## 1) Computer par chalana
```bash
npm install
npm run dev        # http://localhost:5173
```
Bina kisi setup ke site **demo mode** me chalti hai (data sirf usi browser me save hota hai).
Admin: `http://localhost:5173/admin` - password `admin123`.

## 2) Asli (live) use ke liye Firebase lagayein (free)
Demo mode me customer ka order admin ke phone/computer par nahi pahunchta, kyunke data browser me hota hai.
Sab devices par live chalane ke liye free Firebase database lagayein:

1. https://console.firebase.google.com par **Add project** karein.
2. **Build > Firestore Database > Create database** (production mode).
3. **Build > Authentication > Get started > Email/Password** enable karein, phir **Users > Add user** se admin ki email aur password banayein.
4. **Project settings > General > Your apps > Web (</>)** se app banayein; jo config mile use `.env` file me daalein (`.env.example` ko copy karke `.env` banayein).
5. **Firestore > Rules** me `firestore.rules` file ka content paste karke Publish karein.
6. Dobara `npm run dev`, `/admin` par apni email/password se login karein. Pehli login par default menu database me khud save ho jata hai.

## 3) Vercel par free live karna
1. Project ko GitHub par upload karein (ya `npx vercel` chalayein).
2. https://vercel.com par **Add New > Project**, repo chunein (Framework: Vite khud detect ho jata hai).
3. **Environment Variables** me `.env` ki saari `VITE_...` values daalein.
4. Deploy dabayein. `vercel.json` page refresh ke masle khud theek kar deta hai.
5. Firebase Authentication > Settings > **Authorized domains** me apna `xxx.vercel.app` domain add karein.

## 4) Admin Dashboard (`/admin`)
- **Orders**: naye orders live, awaaz ke saath. Customer ka naam, phone, address, map location, items. Status: Qubool > Rasta me > Delivered / Cancel. Call, WhatsApp, Print.
- **Menu Items**: item add/edit/delete, image upload, size-wise price, "Khatam" on/off, famous item.
- **Categories**, **Deals** (naam, items, price, purani price, image, hide/show), **Settings** (WhatsApp number, phone, address, map, delivery charges, banner text).

## 5) WhatsApp ka kaam kaise karta hai
- Customer order confirm kare to order database/dashboard me save hota hai aur WhatsApp khulta hai jis me **poora order pehle se likha hota hai** (shop ke WhatsApp number par). Customer sirf Send dabata hai.
- Contact form bhi isi tarah seedha WhatsApp par bhejta hai.
- **Bina customer ke Send dabaye khud message** chahiye ho to free CallMeBot use karein: `VITE_CALLMEBOT_PHONE` aur `VITE_CALLMEBOT_APIKEY` `.env` me daalein (guide: callmebot.com). Ya paid WhatsApp Business API.

## 6) Images
Food images Unsplash ke links hain (`src/data/images.js`). Koi image na chale to admin panel se apni photo upload kar dein ya wahan link badal dein. Agar kisi item ki image load na ho to khoobsurat placeholder nazar aata hai.

## 7) Security note
Demo mode ka password browser code me hota hai, isliye asli use me Firebase hi lagayein.
