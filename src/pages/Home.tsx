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
            The vehicles you'd book on Turo — direct from the fleet owner, always{' '}
            <strong className="text-white">5% under the Turo price</strong>. And when you're ready, every
            rental can become a rent-to-own or purchase pathway.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a href="#fleet" className="btn-primary">Browse the fleet</a>
            <Link to="/rent-to-own" className="btn-outline">How rent-to-own works</Link>
          </div>
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
            {[
              ['5% under Turo', 'Live pricing benchmarked daily against Turo listings'],
              ['No middleman', 'Book direct with the owner — faster answers, better service'],
              ['Rent-to-own', 'Business customers can turn rental weeks into ownership'],
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
          <h2 className="font-display font-bold text-3xl mt-2">Always 5% under Turo. Automatically.</h2>
          <p className="mt-4 text-white/70 max-w-2xl leading-relaxed">
            Our pricing engine benchmarks every vehicle against live Turo rates and sets our direct price 5%
            below — refreshed daily. You get the same cars for less; we skip the marketplace fees. Everyone
            wins except the middleman.
          </p>
          <div className="grid sm:grid-cols-3 gap-6 mt-8 text-sm">
            {[
              ['1. Benchmark', 'We track the live Turo rate for each vehicle and its market comparables.'],
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
        <p className="label-caps text-brand-red">The twist</p>
        <h2 className="font-display font-bold text-3xl mt-2">Every rental is a road to ownership</h2>
        <div className="grid sm:grid-cols-3 gap-6 mt-8">
          {[
            ['Rent', 'Book by the day, week or month at 5% under Turo. Every week you drive is a real-world test drive.', 'Available to everyone'],
            ['Rent-to-own', 'Business customers can convert to a weekly rent-to-own plan where payments build toward ownership.', 'ABN holders'],
            ['Own', 'Buy outright at any point. Ask for the buyout figure on any vehicle in the fleet.', 'Drive away'],
          ].map(([t, d, tag], i) => (
            <div key={t} className="relative border border-white/10 rounded-lg p-6 bg-white/[0.02]">
              <span className="font-display font-black text-5xl text-white/10 absolute top-4 right-5">{i + 1}</span>
              <p className="font-display font-bold text-2xl">{t}</p>
              <p className="text-white/60 mt-3 text-sm leading-relaxed">{d}</p>
              <p className="label-caps text-brand-red mt-4">{tag}</p>
            </div>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/rent-to-own" className="btn-primary">Explore rent-to-own</Link>
        </div>
      </section>
    </main>
  )
}
