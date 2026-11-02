export default function SectionTitle({ kicker, title, sub, light = false, center = true }) {
  return (
    <div className={`mb-10 ${center ? 'text-center' : ''}`}>
      {kicker && (
        <span className={`inline-block rounded-full px-4 py-1 text-xs font-bold uppercase tracking-[.2em] ${light ? 'bg-white/15 text-sun-400' : 'bg-brand-100 text-brand-700'}`}>{kicker}</span>
      )}
      <h2 className={`mt-3 font-display text-4xl sm:text-5xl md:text-6xl ${light ? 'text-white' : 'text-ink-900'}`}>{title}</h2>
      {sub && <p className={`mx-auto mt-3 max-w-2xl text-base ${light ? 'text-white/75' : 'text-ink-900/60'}`}>{sub}</p>}
    </div>
  )
}
