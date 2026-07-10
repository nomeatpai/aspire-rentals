import { Link } from 'react-router-dom'

export default function Nav() {
  return (
    <nav className="sticky top-0 z-50 bg-brand-black/95 backdrop-blur border-b border-white/10">
      <div className="border-t-4 border-brand-red" />
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link to="/" className="flex flex-col leading-tight">
          <span className="font-display font-black text-xl">
            ASPIRE <span className="text-brand-red">RENTALS</span>
          </span>
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">
            by Aspire Automotive Solutions
          </span>
        </Link>
        <div className="flex items-center gap-6 text-sm">
          <a href="/#fleet" className="hidden sm:block text-white/70 hover:text-white transition-colors">
            The Fleet
          </a>
          <Link to="/rent-to-own" className="hidden sm:block text-white/70 hover:text-white transition-colors">
            Rent-to-Own
          </Link>
          <a href="/#fleet" className="bg-brand-red hover:bg-brand-redDark px-5 py-2.5 rounded font-semibold uppercase tracking-wider text-xs transition-colors">
            Book Now
          </a>
        </div>
      </div>
    </nav>
  )
}
