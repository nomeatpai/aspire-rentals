import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchCatalogue, type Listing, type Pricing } from '../lib/api'
import VehicleCard from '../components/VehicleCard'

export default function Home() {
  const [listings, setListings] = useState<Listing[]>([])
  const [pricing, setPricing] = useState<Map<string, Pricing>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCatalogue().then(({ listings, pricing }) => {
      setListings(listings)
      setPricing(pricing)
      setLoading(false)
    })
  }, [])

  const lux = listings.filter((l) => l.collection === 'luxury')
  const fleet = listings.filter((l) => l.collection === 'fleet')

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-midnight via-brand-black to-brand-black" />
        <div className="relative max-w-6xl mx-auto px-5 py-24 sm:py-32">
          <p className="label-caps text-brand-red mb-4">Sydney · Direct-booked luxury fleet</p>
          <h1 className="font-display font-black text-4xl sm:text-6xl leading-tight max-w-3xl">
            Drive it. Love it. <span className="text-brand-red">Own it.</span>
          </h1>
          <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
            Every other rental company takes your money and takes the car back. We're the only fleet where{' '}
            <strong className="text-white">your rental payments can count toward owning the car</strong> — and
            you're always <strong className="text-white">5% under the car-sharing app price</strong>, verified
            daily by software.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#fleet" className="btn-primary">Browse the fleet</a>
            <Link to="/rent-to-own" className="btn-outline">The Ownership Ladder</Link>
          </div>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              ['Always 5% under the apps', 'Our pricing engine checks the marketplace rate daily and undercuts it. Automatically.'],
              ['Rental money that works', 'Convert to an ownership plan and recent rental weeks credit toward it.'],
              ['Walk away any week', "It's a rental until you choose otherwise. No loan. No lock-in. No bank."],
            ].map(([t, d]) => (
              <div key={t} className="border-l-2 border-brand-red pl-4">
                <p className="font-bold">{t}</p>
                <p className="text-sm text-white/55 mt-1">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FLEET */}
      <section id="fleet" className="max-w-6xl mx-auto px-5 pt-20">
        <p className="label-caps text-brand-red">The collection</p>
        <h2 className="font-display font-bold text-3xl mt-2">Luxury Fleet</h2>
        {loading ? (
          <p className="text-white/50 mt-8">Loading live pricing…</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-6 mt-8">
            {lux.map((l) => (
              <VehicleCard key={l.id} listing={l} pricing={pricing.get(l.id)} />
            ))}
          </div>
        )}
        {fleet.length > 0 && (
          <>
            <h2 className="font-display font-bold text-3xl mt-16">Work & Fleet Vehicles</h2>
            <div className="grid sm:grid-cols-2 gap-6 mt-8">
              {fleet.map((l) => (
                <VehicleCard key={l.id} listing={l} pricing={pricing.get(l.id)} />
              ))}
            </div>
          </>
        )}
      </section>

      {/* PRICE PROMISE */}
      <section id="price-promise" className="max-w-6xl mx-auto px-5 pt-24">
        <div className="rounded-lg bg-gradient-to-br from-brand-midnight to-brand-black border border-white/10 p-8 sm:p-12">
          <p className="label-caps text-brand-red">The price promise</p>
          <h2 className="font-display font-bold text-3xl mt-2">Always 5% under the app price. Automatically.</h2>
          <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
            You could book these exact cars on the big car-sharing apps. Our pricing engine benchmarks every
            vehicle against live marketplace rates and sets our direct price 5% below — refreshed daily. Same
            cars for less; we skip the marketplace fees. Everyone wins except the middleman.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mt-8 text-sm">
            {[
              ['1. Benchmark', 'We track the live marketplace rate for each vehicle and its comparables.'],
              ['2. Undercut', 'Our engine prices every car 5% under the benchmark, every day.'],
              ['3. You book direct', 'Same car, lower price, direct line to the owner.'],
            ].map(([t, d]) => (
              <div key={t} className="bg-white/[0.03] border border-white/10 rounded p-5">
                <p className="font-bold text-brand-red">{t}</p>
                <p className="text-white/60 mt-2 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OWNERSHIP LADDER */}
      <section className="max-w-6xl mx-auto px-5 pt-24">
        <p className="label-caps text-brand-red">The Aspire Ownership Ladder</p>
        <h2 className="font-display font-bold text-3xl mt-2">
          Rent it. Love it. <span className="text-brand-red">Keep it.</span>
        </h2>
        <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
          Every week you rent is a real-world test drive. Decide to keep the car and your recent rental
          payments can credit into an ownership plan — with a fixed weekly amount and a buyout figure that's
          printed on the agreement from day one, never renegotiated.
        </p>
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[
            ['Rent', 'Book by the day, week or month at 5% under the app price. Walk away any week — no loan, no lock-in.', 'Everyone'],
            ['Convert', 'Keep the car on a fixed weekly plan. Up to 4 recent rental weeks credit toward it. Maintenance stays our problem until title passes.', 'ABN holders — in-house'],
            ['Own', 'Hit the end of term, or pay the printed buyout figure early. No ABN? Buy outright with finance arranged through a licensed partner.', 'Drive away'],
          ].map(([t, d, tag], i) => (
            <div key={t} className="relative border border-white/10 rounded-lg p-6 bg-white/[0.02]">
              <span className="font-display font-black text-5xl text-white/10 absolute top-4 right-5">{i + 1}</span>
              <p className="font-display font-bold text-2xl">{t}</p>
              <p className="text-white/60 mt-3 text-sm leading-relaxed">{d}</p>
              <p className="label-caps text-brand-red mt-4">{tag}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/45">
          The Ownership Ladder runs on a small fleet by design — when the current vehicles are allocated, the
          program closes until we acquire more.
        </p>
        <div className="mt-6">
          <Link to="/rent-to-own" className="btn-primary">Explore the Ownership Ladder</Link>
        </div>
      </section>
    </main>
  )
}
