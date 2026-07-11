import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-6xl mx-auto px-5 py-12 grid gap-8 sm:grid-cols-3 text-sm text-white/60">
        <div>
          <p className="font-display font-black text-lg text-white mb-2">
            ASPIRE <span className="text-brand-red">RENTALS</span>
          </p>
          <p>Run a smarter fleet.</p>
          <p className="mt-3 text-white/40 text-xs leading-relaxed">
            Aspire Automotive Solutions Pty Ltd
            <br />
            ABN 91 689 366 103
          </p>
        </div>
        <div>
          <p className="label-caps text-brand-red mb-3">Explore</p>
          <ul className="space-y-2">
            <li><a href="/#fleet" className="hover:text-white">The Fleet</a></li>
            <li><Link to="/rent-to-own" className="hover:text-white">Rent-to-Own</Link></li>
            <li><a href="/#price-promise" className="hover:text-white">Price Promise</a></li>
            <li><a href="https://aspireautos.com.au" className="hover:text-white">Fleet Management</a></li>
          </ul>
        </div>
        <div>
          <p className="label-caps text-brand-red mb-3">Contact</p>
          <ul className="space-y-2">
            <li><a href="mailto:help@aspireautos.com.au" className="hover:text-white">help@aspireautos.com.au</a></li>
            <li>3/125 Russell Street, Emu Plains NSW 2750</li>
            <li>aspireautos.com.au</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-white/35 px-5">
        In-house ownership plans are offered to business customers (ABN holders); outright purchase with
        finance is available through a licensed finance partner, subject to approval and formal agreement.
        Pricing benchmarks refresh daily against comparable car-sharing marketplace listings.
      </div>
    </footer>
  )
}
