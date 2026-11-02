import { useData } from '../context/DataContext'
import DealCard from '../components/DealCard'
import PageHero from '../components/PageHero'
import Reveal from '../components/Reveal'

export default function Deals() {
  const { deals } = useData()
  const list = deals.filter((d) => d.active !== false)
  return (
    <>
      <PageHero kicker="Super Savings" title="Hot Deals" sub="Combos that are easy on your wallet and great for your appetite. Order in one click!" />
      <section className="py-12 sm:py-20">
        <div className="container-x">
          {list.length === 0 && <p className="py-20 text-center text-ink-900/50">No deals right now. Check back soon!</p>}
          <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {list.map((d, k) => <Reveal key={d.id} delay={(k % 3) * 90}><DealCard deal={d} /></Reveal>)}
          </div>
        </div>
      </section>
    </>
  )
}
