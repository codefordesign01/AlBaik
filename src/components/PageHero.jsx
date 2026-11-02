export default function PageHero({ title, sub, kicker }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-ink-950 via-brand-900 to-brand-700 pb-14 pt-32 text-center sm:pb-20 sm:pt-40">
      <div className="dots-bg absolute inset-0" />
      <div className="absolute -left-10 top-10 h-52 w-52 animate-floaty rounded-full bg-sun-500/25 blur-3xl" />
      <div className="container-x relative">
        {kicker && <span className="rounded-full bg-white/15 px-4 py-1 text-xs font-bold uppercase tracking-[.2em] text-sun-400">{kicker}</span>}
        <h1 className="mt-3 font-display text-6xl text-white sm:text-8xl">{title}</h1>
        {sub && <p className="mx-auto mt-3 max-w-2xl text-white/75">{sub}</p>}
      </div>
    </section>
  )
}
