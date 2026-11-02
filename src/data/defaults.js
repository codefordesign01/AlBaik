import { IMG } from './images'

export const DATA_VERSION = 2

export const DEFAULT_SETTINGS = {
  id: 'main',
  dataVersion: DATA_VERSION,
  name: 'Al Baik',
  tagline: 'Fast Food',
  whatsapp: '923001234567',
  phone: '0300 1234567',
  email: 'info@example.com',
  address: 'Main Market, Your Street, Your City',
  mapQuery: 'Main Market Lahore',
  hours: 'Daily 12:00 PM - 02:00 AM',
  deliveryFee: 100,
  minOrder: 0,
  heroTitle: 'Hungry? Hot, fresh & delicious is right here!',
  heroSub: 'Juicy burgers, loaded shawarma, crispy wings and tangy chaat – freshly made and delivered right to your door.',
  facebook: '',
  instagram: '',
  tiktok: '',
}

export const DEFAULT_CATEGORIES = [
  { id: 'shawarma', name: 'Shawarma & Rolls', emoji: '🌯', order: 1 },
  { id: 'burgers', name: 'Burgers', emoji: '🍔', order: 2 },
  { id: 'wings', name: 'Wings', emoji: '🍗', order: 3 },
  { id: 'fries', name: 'Fries', emoji: '🍟', order: 4 },
  { id: 'chaat', name: 'Chaat & Snacks', emoji: '🥗', order: 5 },
  { id: 'drinks', name: 'Drinks & Shakes', emoji: '🥤', order: 6 },
]

// Prices: menu price + 100. You can change them anytime from the admin panel.
const v = (label, price) => ({ label, price })
let n = 0
const item = (id, name, category, desc, image, variants, popular = false) => ({
  id, name, category, desc, image, variants, popular, available: true, order: ++n,
})

export const DEFAULT_ITEMS = [
  item('chicken-shawarma', 'Chicken Shawarma', 'shawarma', 'Soft pita, juicy grilled chicken, garlic sauce and crunchy salad.', IMG.shawarma, [v('Small', 200), v('Large', 250)], true),
  item('zinger-shawarma', 'Zinger Shawarma', 'shawarma', 'Crispy zinger strips wrapped with mayo and tangy sauce.', IMG.roll, [v('Small', 270), v('Large', 300)], true),
  item('zinger-jumbo-shawarma', 'Zinger Jumbo Shawarma', 'shawarma', 'Jumbo size with double filling – the cure for big hunger.', IMG.shawarma, [v('Jumbo', 350)]),
  item('shawarma-platter', 'Shawarma Platter', 'shawarma', 'Full platter with shawarma, fries, salad and sauces.', IMG.chicken, [v('Platter', 500)]),
  item('paratha-roll', 'Chicken Paratha Roll', 'shawarma', 'Tangy chicken filling in a crispy paratha.', IMG.roll, [v('Small', 300), v('Large', 350)]),

  item('anda-shami-burger', 'Anda Shami Burger', 'burgers', 'Desi shami kabab, egg and special sauce.', IMG.burger4, [v('Regular', 250)]),
  item('zinger-burger', 'Zinger Burger', 'burgers', 'Crunchy zinger fillet, fresh lettuce and creamy mayo.', IMG.burger, [v('Regular', 350)], true),
  item('zinger-cheese-burger', 'Zinger Cheese Burger', 'burgers', 'Zinger fillet topped with an extra layer of melted cheese.', IMG.burger3, [v('Regular', 400)], true),
  item('anda-chicken-shami-burger', 'Anda Chicken Shami Burger', 'burgers', 'A delicious combination of chicken shami and egg.', IMG.burger2, [v('Regular', 300)]),
  item('patty-burger', 'Patty Burger', 'burgers', 'Juicy grilled patty, cheese slice and house sauce.', IMG.burger2, [v('Regular', 350)]),

  item('hot-wings', 'Hot Wings', 'wings', 'Crispy fried wings with a spicy glaze.', IMG.wings, [v('6 Pcs', 500), v('12 Pcs', 900)], true),

  item('fries', 'Fries', 'fries', 'Golden, crispy and perfectly salted.', IMG.fries, [v('Half', 150), v('Full', 200)], true),
  item('flavour-fries', 'Flavour Fries', 'fries', 'Fries with masala / peri-peri flavour.', IMG.fries2, [v('Regular', 250)]),
  item('snack-fries', 'Snack Fries', 'fries', 'Loaded fries with sauces and toppings.', IMG.fries2, [v('Regular', 250)]),

  item('dahi-bhallay', 'Dahi Bhallay', 'chaat', 'Soft bhallay, chilled yogurt and tamarind chutney.', IMG.chaat, [v('Plate', 250)]),
  item('chana-chaat', 'Chana Chaat', 'chaat', 'Spicy chickpeas, onion and tangy chutney.', IMG.chaat, [v('Plate', 250)]),
  item('fruit-chaat', 'Fruit Chaat', 'chaat', 'Fresh seasonal fruit with chaat masala and lemon.', IMG.fruit, [v('Regular', 250), v('Large', 300)]),
  item('cream-chaat', 'Cream Chaat', 'chaat', 'A sweet, creamy mix of fruit and cream.', IMG.fruit, [v('Regular', 250), v('Large', 300)]),
  item('samosa-chaat', 'Samosa Chaat', 'chaat', 'Crispy samosa with chickpeas, yogurt and chutney.', IMG.chaat, [v('Plate', 250)]),
  item('samosa', 'Samosa', 'chaat', 'Hot, crispy samosa.', IMG.chaat, [v('1 Pc', 110)]),
  item('gol-gappay', 'Gol Gappay', 'chaat', 'Tangy gol gappay with sweet and sour water.', IMG.chaat, [v('Regular', 300), v('Large', 350)]),

  item('lemon-soda-sada', 'Lemon Soda (Sada)', 'drinks', 'Cold, zesty lemon soda.', IMG.soda, [v('Glass', 200)]),
  item('lemon-soda-doodh', 'Lemon Soda (Doodh)', 'drinks', 'Creamy lemon soda with milk.', IMG.soda, [v('Glass', 250)]),
  item('mint-margarita', 'Mint Margarita', 'drinks', 'A refreshing blend of mint and lemon.', IMG.soda, [v('Glass', 250)], true),
  item('fresh-juice', 'Fresh Juice', 'drinks', 'Fresh fruit juice in your choice of size.', IMG.juice, [v('Small', 200), v('Medium', 250), v('Large', 300)]),
  item('special-juice', 'Special Juice', 'drinks', 'Mixed fruit special juice – our signature recipe.', IMG.juice, [v('Glass', 450)]),
  item('mango-shake', 'Mango Shake', 'drinks', 'Ripe mango, milk and ice cream.', IMG.shake, [v('Regular', 250), v('Large', 300)], true),
  item('banana-shake', 'Banana Shake', 'drinks', 'Thick creamy banana shake.', IMG.shake, [v('Regular', 250), v('Large', 300)]),
  item('peach-shake', 'Peach Shake', 'drinks', 'Sweet and aromatic peach shake.', IMG.shake, [v('Regular', 250), v('Large', 300)]),
  item('strawberry-shake', 'Strawberry Shake', 'drinks', 'Fresh strawberry and ice cream.', IMG.shake, [v('Regular', 250), v('Large', 300)]),
]

export const DEFAULT_DEALS = [
  { id: 'deal-duo-burger', title: 'Double Burger Deal', badge: 'BEST SELLER', desc: '2 zinger burgers with a 1.5L cold drink absolutely FREE.', items: ['2 x Zinger Burger', '1.5L Cold Drink FREE'], price: 649, oldPrice: 750, image: IMG.burger, active: true, order: 1 },
  { id: 'deal-family', title: 'Family Feast', badge: 'FAMILY', desc: 'For the whole family: burgers, wings, fries and a drink.', items: ['2 x Zinger Burger', '6 Pcs Hot Wings', 'Full Fries', '1.5L Cold Drink FREE'], price: 1299, oldPrice: 1500, image: IMG.wings, active: true, order: 2 },
  { id: 'deal-shawarma', title: 'Shawarma Duo', badge: 'HOT', desc: '2 large chicken shawarma + half fries + free drink.', items: ['2 x Large Chicken Shawarma', 'Half Fries', 'Cold Drink FREE'], price: 599, oldPrice: 700, image: IMG.shawarma, active: true, order: 3 },
  { id: 'deal-wings', title: 'Wings Party', badge: 'PARTY', desc: '12 crispy wings with 2 full fries and drinks.', items: ['12 Pcs Hot Wings', '2 x Full Fries', '2 x Cold Drink FREE'], price: 1199, oldPrice: 1400, image: IMG.chicken, active: true, order: 4 },
  { id: 'deal-student', title: 'Student Saver', badge: 'SAVER', desc: 'Patty burger + half fries + drink – full flavor on a budget.', items: ['Patty Burger', 'Half Fries', 'Cold Drink FREE'], price: 499, oldPrice: 600, image: IMG.burger2, active: true, order: 5 },
  { id: 'deal-sweet', title: 'Shake & Chaat', badge: 'SWEET', desc: 'Any shake + fruit chaat together at a lower price.', items: ['Any Shake', 'Fruit Chaat'], price: 449, oldPrice: 550, image: IMG.shake, active: true, order: 6 },
]
