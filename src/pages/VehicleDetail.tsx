import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { createBooking, createEnquiry, fetchListing, fmt, getQuote, type Listing, type Pricing, type Quote } from '../lib/api'
import { VehicleVisual } from '../components/VehicleCard'

function addDays(d: string, n: number) {
  const x = new Date(d)
  x.setDate(x.getDate() + n)
  return x.toISOString().slice(0, 10)
}

export default function VehicleDetail() {
  const { slug } = useParams()
  const [listing, setListing] = useState<Listing | null>(null)
  const [pricing, setPricing] = useState<Pricing | null>(null)
  const [loading, setLoading] = useState(true)

  const today = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const [start, setStart] = useState(addDays(today, 2))
  const [end, setEnd] = useState(addDays(today, 9))
  const [quote, setQuote] = useState<Quote | null>(null)
  const [quoting, setQuoting] = useState(false)

  const [form, setForm] = useState({ customer_name: '', company: '', abn: '', email: '', phone: '', interest: 'rent', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ ok?: boolean; ref?: string; error?: string } | null>(null)

  const [enq, setEnq] = useState({ name: '', company: '', abn: '', email: '', phone: '', message: '', type: 'rent_to_own' })
  const [enqSent, setEnqSent] = useState(false)
  const [enqSubmitting, setEnqSubmitting] = useState(false)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    fetchListing(slug).then(({ listing, pricing }) => {
      setListing(listing)
      setPricing(pricing)
      setLoading(false)
    })
  }, [slug])

  useEffect(() => {
    if (!listing || !start || !end || end <= start) {
      setQuote(null)
      return
    }
    setQuoting(true)
    const t = setTimeout(() => {
      getQuote(listing.id, start, end).then((q) => {
        setQuote(q)
        setQuoting(false)
      })
    }, 250)
    return () => clearTimeout(t)
  }, [listing, start, end])

  if (loading) return <main className="max-w-6xl mx-auto px-5 py-24 text-white/50">Loading…</main>
  if (!listing)
    return (
      <main className="max-w-6xl mx-auto px-5 py-24">
        <p>Vehicle not found.</p>
        <Link to="/" className="text-brand-red">← Back to the fleet</Link>
      </main>
    )

  const submitBooking = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!quote || quote.error || !quote.available) return
    setSubmitting(true)
    const res = await createBooking({ listing_id: listing.id, start_date: start, end_date: end, ...form })
    setResult(res)
    setSubmitting(false)
  }

  const submitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault()
    setEnqSubmitting(true)
    await createEnquiry({ listing_id: listing.id, ...enq })
    setEnqSent(true)
    setEnqSubmitting(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-10">
      <Link to="/" className="text-sm text-white/50 hover:text-white">← All vehicles</Link>

      <div className="grid lg:grid-cols-5 gap-10 mt-6">
        {/* LEFT: visual + info */}
        <div className="lg:col-span-3">
          <div className="rounded-lg overflow-hidden border border-white/10">
            <VehicleVisual listing={listing} tall />
          </div>
          <p className="label-caps text-brand-red mt-8">{listing.year} · {listing.body_type} · {listing.location}</p>
          <h1 className="font-display font-black text-3xl sm:text-4xl mt-2">{listing.display_name}</h1>
          <p className="mt-4 text-white/70 leading-relaxed">{listing.description}</p>

          <div className="flex gap-2 mt-6 flex-wrap">
            {[listing.seats && `${listing.seats} seats`, listing.transmission, listing.fuel_type, listing.drive_type, listing.body_type]
              .filter(Boolean)
              .map((c) => (
                <span key={String(c)} className="text-xs bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-white/70">
                  {c}
                </span>
              ))}
          </div>

          {Array.isArray(listing.highlights) && listing.highlights.length > 0 && (
            <ul className="mt-8 grid sm:grid-cols-2 gap-3">
              {listing.highlights.map((h) => (
                <li key={h} className="flex items-start gap-3 text-sm text-white/75">
                  <span className="text-brand-red font-bold mt-0.5">—</span> {h}
                </li>
              ))}
            </ul>
          )}

          {/* OWNERSHIP PATHWAY */}
          <div className="mt-10 rounded-lg border border-amber-400/30 bg-amber-400/[0.04] p-6">
            <p className="label-caps text-amber-400">Ownership pathway</p>
            <h3 className="font-display font-bold text-xl mt-2">Want to keep it?</h3>
            <p className="text-sm text-white/65 mt-2 leading-relaxed">
              This vehicle is available on a rent-to-own plan for business customers (ABN holders)
              {listing.buyout_price ? (
                <> or outright purchase from <strong className="text-white">{fmt(listing.buyout_price)}</strong></>
              ) : (
                <> or outright purchase — ask for the buyout figure</>
              )}
              . Rental weeks you've already paid can count toward your plan.
            </p>
            {enqSent ? (
              <p className="mt-4 text-emerald-400 font-semibold">
                Enquiry received — we'll come back to you within one business day.
              </p>
            ) : (
              <form onSubmit={submitEnquiry} className="mt-5 grid sm:grid-cols-2 gap-3">
                <input required placeholder="Your name" value={enq.name} onChange={(e) => setEnq({ ...enq, name: e.target.value })} />
                <input required type="email" placeholder="Email" value={enq.email} onChange={(e) => setEnq({ ...enq, email: e.target.value })} />
                <input placeholder="Company" value={enq.company} onChange={(e) => setEnq({ ...enq, company: e.target.value })} />
                <input placeholder="ABN" value={enq.abn} onChange={(e) => setEnq({ ...enq, abn: e.target.value })} />
                <select value={enq.type} onChange={(e) => setEnq({ ...enq, type: e.target.value })} className="sm:col-span-2">
                  <option value="rent_to_own">I'm interested in rent-to-own</option>
                  <option value="buy">I want to buy this vehicle</option>
                  <option value="fleet">I need multiple vehicles for my fleet</option>
                </select>
                <button disabled={enqSubmitting} className="btn-primary sm:col-span-2">
                  {enqSubmitting ? 'Sending…' : 'Start the conversation'}
                </button>
              </form>
            )}
          </div>
        </div>

        {/* RIGHT: booking panel */}
        <div className="lg:col-span-2">
          <div className="sticky top-24 rounded-lg border border-white/15 bg-white/[0.03] p-6">
            {pricing?.our_daily != null && (
              <>
                <p className="text-3xl font-extrabold">
                  {fmt(pricing.our_daily)} <span className="text-base font-medium text-white/50">/day</span>
                </p>
                {pricing.benchmark_daily != null && (
                  <p className="text-sm text-white/50 mt-1">
                    <span className="line-through">{fmt(pricing.benchmark_daily)}/day on Turo</span>{' '}
                    <span className="text-brand-red font-semibold">{Number(pricing.discount_pct)}% less direct</span>
                  </p>
                )}
                <div className="grid grid-cols-2 gap-3 mt-4 text-sm">
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-white/50 text-xs">Weekly</p>
                    <p className="font-bold">{fmt(pricing.our_weekly)}</p>
                  </div>
                  <div className="bg-white/5 rounded p-3">
                    <p className="text-white/50 text-xs">Monthly</p>
                    <p className="font-bold">{fmt(pricing.our_monthly)}</p>
                  </div>
                </div>
              </>
            )}

            {result?.ok ? (
              <div className="mt-6 rounded border border-emerald-500/40 bg-emerald-500/10 p-5">
                <p className="font-bold text-emerald-400">Booking request received ✓</p>
                <p className="text-sm mt-2 text-white/75">
                  Reference <strong>{result.ref}</strong>. We confirm availability and send your secure payment
                  link within hours — usually much faster.
                </p>
              </div>
            ) : (
              <form onSubmit={submitBooking} className="mt-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-white/50">Pick up</label>
                    <input type="date" min={today} value={start} onChange={(e) => setStart(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-xs text-white/50">Return</label>
                    <input type="date" min={start} value={end} onChange={(e) => setEnd(e.target.value)} />
                  </div>
                </div>

                {quoting && <p className="text-sm text-white/40">Updating quote…</p>}
                {quote && !quote.error && (
                  <div className="rounded bg-white/5 p-4 text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-white/60">{quote.days} days × {fmt(quote.daily)}</span>
                      <span className="font-bold">{fmt(quote.total)}</span>
                    </div>
                    <div className="flex justify-between text-xs text-white/45">
                      <span>Bond (refundable)</span>
                      <span>{fmt(listing.bond_aud)}</span>
                    </div>
                    {!quote.available && (
                      <p className="text-amber-400 font-semibold pt-1">
                        Those dates are taken — try different dates or enquire below.
                      </p>
                    )}
                  </div>
                )}
                {quote?.error === 'below_min_days' && (
                  <p className="text-amber-400 text-sm">Minimum {listing.min_days} days for this vehicle.</p>
                )}

                <input required placeholder="Full name" value={form.customer_name} onChange={(e) => setForm({ ...form, customer_name: e.target.value })} />
                <input required type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Company (optional)" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
                  <input placeholder="ABN (optional)" value={form.abn} onChange={(e) => setForm({ ...form, abn: e.target.value })} />
                </div>
                <select value={form.interest} onChange={(e) => setForm({ ...form, interest: e.target.value })}>
                  <option value="rent">Just renting for now</option>
                  <option value="rent_to_own">Interested in rent-to-own</option>
                  <option value="buy">Interested in buying</option>
                </select>
                <button
                  disabled={submitting || !quote || !!quote.error || !quote.available || quote.days < (listing.min_days || 1)}
                  className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Sending…' : `Request booking${quote && !quote.error ? ` · ${fmt(quote.total)}` : ''}`}
                </button>
                <p className="text-[11px] text-white/40 leading-relaxed">
                  No payment taken now. We confirm availability and send a secure payment link. Minimum{' '}
                  {listing.min_days} days.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
