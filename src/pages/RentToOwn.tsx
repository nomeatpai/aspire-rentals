import { useState } from 'react'
import { createEnquiry } from '../lib/api'

export default function RentToOwn() {
  const [enq, setEnq] = useState({ name: '', company: '', abn: '', email: '', phone: '', message: '', type: 'rent_to_own' })
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await createEnquiry(enq)
    setSent(true)
    setSubmitting(false)
  }

  return (
    <main className="max-w-6xl mx-auto px-5 py-16">
      <p className="label-caps text-brand-red">For business customers</p>
      <h1 className="font-display font-black text-4xl sm:text-5xl mt-2 max-w-2xl leading-tight">
        Rent the car. <span className="text-brand-red">Keep the car.</span>
      </h1>
      <p className="mt-6 text-lg text-white/70 max-w-2xl leading-relaxed">
        Rent-to-own turns your weekly rental into a pathway to ownership. Fixed weekly payments, a known
        buyout figure, and the vehicle working for your business from day one — without a bank loan
        application in sight.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
        {[
          ['Week 0', 'Start on a normal rental — 5% under the app price. Test the car in your real operation.'],
          ['Convert', 'Decide to keep it. We agree a weekly plan and term, and recent rental weeks can count toward it.'],
          ['Drive & pay', 'Fixed weekly payments while the car earns for your business. Maintenance stays our problem until title passes.'],
          ['Own', 'Hit the end of term — or pay the buyout figure early — and the vehicle is yours.'],
        ].map(([t, d], i) => (
          <div key={t} className="relative border border-white/10 rounded-lg p-6 bg-white/[0.02]">
            <span className="font-display font-black text-5xl text-white/10 absolute top-4 right-5">{i + 1}</span>
            <p className="font-display font-bold text-xl">{t}</p>
            <p className="text-white/60 mt-3 text-sm leading-relaxed">{d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-white/10 bg-white/[0.02] p-6 sm:p-8 max-w-3xl">
        <p className="label-caps text-brand-red">Who it's for</p>
        <p className="mt-3 text-white/70 leading-relaxed text-sm sm:text-base">
          In-house weekly plans are offered to <strong className="text-white">business customers with an
          active ABN</strong> — rideshare and delivery operators, trades, chauffeur services, and companies
          building a fleet without tying up capital. Every plan is documented in a formal agreement with a
          transparent payment schedule and a buyout figure that never moves. Not a consumer credit product.
        </p>
        <p className="mt-3 text-white/70 leading-relaxed text-sm sm:text-base">
          <strong className="text-white">No ABN?</strong> You can still own the car — buy outright with
          finance arranged through a licensed finance partner, subject to their approval. We introduce you;
          they handle the finance conversation.
        </p>
      </div>

      <div className="mt-12 max-w-2xl">
        <h2 className="font-display font-bold text-2xl">Start the conversation</h2>
        {sent ? (
          <p className="mt-5 text-emerald-400 font-semibold">
            Enquiry received — we'll come back to you within one business day.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 grid sm:grid-cols-2 gap-3">
            <input required placeholder="Your name" value={enq.name} onChange={(e) => setEnq({ ...enq, name: e.target.value })} />
            <input required type="email" placeholder="Email" value={enq.email} onChange={(e) => setEnq({ ...enq, email: e.target.value })} />
            <input placeholder="Company" value={enq.company} onChange={(e) => setEnq({ ...enq, company: e.target.value })} />
            <input placeholder="ABN" value={enq.abn} onChange={(e) => setEnq({ ...enq, abn: e.target.value })} />
            <textarea
              placeholder="What are you looking for? (vehicle, term, budget)"
              rows={4}
              className="sm:col-span-2"
              value={enq.message}
              onChange={(e) => setEnq({ ...enq, message: e.target.value })}
            />
            <button disabled={submitting} className="btn-primary sm:col-span-2">
              {submitting ? 'Sending…' : 'Enquire about rent-to-own'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
