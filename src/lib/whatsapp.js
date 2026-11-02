import { money } from './utils'

export function normalizePhone(p = '') {
  let d = String(p).replace(/\D/g, '')
  if (d.startsWith('00')) d = d.slice(2)
  if (d.startsWith('0')) d = '92' + d.slice(1)
  return d
}

export const waLink = (number, text) =>
  `https://wa.me/${normalizePhone(number)}?text=${encodeURIComponent(text)}`

export function orderMessage(o, shopName = 'Al Baik') {
  const lines = o.items.map((i) => `• ${i.qty} x ${i.name}${i.variant ? ` (${i.variant})` : ''} = ${money(i.price * i.qty)}`)
  return [
    `🍔 *NEW ORDER ${o.orderNo}* - ${shopName}`,
    '',
    ...lines,
    '',
    `Subtotal: ${money(o.subtotal)}`,
    `Delivery: ${money(o.deliveryFee)}`,
    `*Total: ${money(o.total)}* (Cash on Delivery)`,
    '',
    `👤 Name: ${o.customer.name}`,
    `📞 Phone: ${o.customer.phone}`,
    `📍 Address: ${o.customer.address}${o.customer.landmark ? ` (${o.customer.landmark})` : ''}`,
    o.customer.location?.link ? `🗺️ Location: ${o.customer.location.link}` : null,
    o.customer.notes ? `📝 Note: ${o.customer.notes}` : null,
  ].filter((x) => x !== null).join('\n')
}

// Optional: CallMeBot (free) se admin ke WhatsApp par khud-ba-khud message
export function autoNotify(number, text) {
  const phone = import.meta.env.VITE_CALLMEBOT_PHONE
  const key = import.meta.env.VITE_CALLMEBOT_APIKEY
  if (!phone || !key) return
  fetch(`https://api.callmebot.com/whatsapp.php?phone=${normalizePhone(phone)}&text=${encodeURIComponent(text)}&apikey=${key}`, { mode: 'no-cors' }).catch(() => {})
}
