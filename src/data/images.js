// All images come from here. If an image does not load, upload your own from the admin panel
// or change the link below.
const u = (id, w = 900) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`

export const IMG = {
  burger: u('1568901346375-23c9450c58cd'),
  burger2: u('1550547660-d9450f859349'),
  burger3: u('1606755962773-d324e0a13086'),
  burger4: u('1561758033-d89a9ad46330'),
  fries: u('1573080496219-bb080dd4f877'),
  fries2: u('1576107232684-1279f390859f'),
  wings: u('1527477396000-e27163b481c2'),
  chicken: u('1562967914-608f82629710'),
  shawarma: u('1529006557810-274b9b2fc783'),
  roll: u('1599487488170-d11ec9c172f0'),
  chaat: u('1601050690597-df0568f70950'),
  fruit: u('1490474418585-ba9bad8fd0ea'),
  shake: u('1572490122747-3968b75cc699'),
  juice: u('1600271886742-f049cd451bba'),
  cola: u('1622483767028-3f66f32aef97'),
  soda: u('1556679343-c7306c1976bc'),
}

export const HERO_SLIDES = [
  { img: u('1568901346375-23c9450c58cd', 1800), label: 'Juicy Zinger Burgers' },
  { img: u('1527477396000-e27163b481c2', 1800), label: 'Crispy Hot Wings' },
  { img: u('1529006557810-274b9b2fc783', 1800), label: 'Loaded Shawarma' },
  { img: u('1573080496219-bb080dd4f877', 1800), label: 'Golden Fries' },
]

export const CAT_FALLBACK = {
  shawarma: IMG.shawarma, burgers: IMG.burger, wings: IMG.wings, fries: IMG.fries, chaat: IMG.chaat, drinks: IMG.shake,
}
