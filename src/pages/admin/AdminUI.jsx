import { useRef, useState } from 'react'
import { X, Upload, Loader2 } from 'lucide-react'
import { fileToDataUrl } from '../../lib/utils'
import FoodImage from '../../components/FoodImage'

export function Modal({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/60 p-0 backdrop-blur-sm sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`flex max-h-[94vh] w-full animate-pop flex-col overflow-hidden rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl ${wide ? 'max-w-3xl' : 'max-w-xl'}`}>
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-4">
          <h3 className="font-display text-3xl">{title}</h3>
          <button onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full bg-black/5 hover:bg-black/10"><X size={18} /></button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  )
}

export const Field = ({ label, hint, children, className = '' }) => (
  <div className={className}>
    <label className="label">{label}</label>
    {children}
    {hint && <p className="mt-1 text-xs text-ink-900/45">{hint}</p>}
  </div>
)

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3 text-sm font-semibold">
      <span className={`relative h-6 w-11 rounded-full transition ${checked ? 'bg-emerald-500' : 'bg-ink-900/20'}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'left-[22px]' : 'left-0.5'}`} />
      </span>
      {label}
    </button>
  )
}

export function ImageInput({ value, onChange }) {
  const ref = useRef(null)
  const [busy, setBusy] = useState(false)
  const pick = async (e) => {
    const f = e.target.files?.[0]
    if (!f) return
    setBusy(true)
    try { onChange(await fileToDataUrl(f)) } finally { setBusy(false); e.target.value = '' }
  }
  return (
    <div className="flex gap-4">
      <FoodImage src={value} alt="preview" className="h-24 w-24 shrink-0 rounded-2xl" />
      <div className="flex-1 space-y-2">
        <input className="input" placeholder="Image link (https://...)" value={value?.startsWith('data:') ? '' : value || ''} onChange={(e) => onChange(e.target.value)} />
        <input ref={ref} type="file" accept="image/*" hidden onChange={pick} />
        <button type="button" onClick={() => ref.current.click()} className="inline-flex items-center gap-2 rounded-full bg-ink-900 px-4 py-2 text-xs font-bold text-white hover:bg-brand-600">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />} {value?.startsWith('data:') ? 'Change image' : 'Upload image'}
        </button>
      </div>
    </div>
  )
}

export const STATUS = {
  new: { label: 'New', cls: 'bg-brand-600 text-white' },
  preparing: { label: 'Preparing', cls: 'bg-sun-500 text-ink-900' },
  delivery: { label: 'Out for delivery', cls: 'bg-sky-500 text-white' },
  delivered: { label: 'Delivered', cls: 'bg-emerald-500 text-white' },
  cancelled: { label: 'Cancel', cls: 'bg-ink-900/70 text-white' },
}
export const StatusBadge = ({ status }) => {
  const s = STATUS[status] || STATUS.new
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${s.cls}`}>{s.label}</span>
}
