import { Link } from 'react-router-dom'
import type { Listing, Pricing } from '../lib/api'
import { fmt } from '../lib/api'

export function VehicleVisual({ listing, tall }: { listing: Listing; tall?: boolean }) {
  if (listing.hero_image_url) {
    return (
      <img
        src={listing.hero_image_url}
        alt={listing.display_name}
        className={`w-full object-cover ${tall ? 'h-80 sm:h-[420px]' : 'h-52'}`}
      />
    )
  }
  return (
    <div
      className={`w-full flex flex-col items-center justify-center bg-gradient-to-br from-brand-midnight via-[#241a2e] to-brand-black ${
        tall ? 'h-80 sm:h-[420px]' : 'h-52'
      }`}
    >
      <span className="font-display font-black text-4xl sm:text-5xl text-white/15 select-none">
        {listing.make.split(' ')[0].toUpperCase()}
      </span>
      <span className="label-caps text-brand-red mt-2">
        {listing.model} {listing.variant ?? ''}
      </span>
      <span className="text-white/25 text-xs mt-3">Photography coming soon</span>
    </div>
  )
}

export default function VehicleCard({ listing, pricing }: { listing: Listing; pricing?: Pricing }) {
  return (
    <Link
      to={`/vehicles/${listing.slug}`}
      className="group relative rounded-lg overflow-hidden border border-white/10 hover:border-brand-red/60 transition-colors bg-white/[0.02]"
    >
      {listing.status === 'coming_soon' && (
        <span className="absolute top-3 left-3 z-10 bg-brand-red text-white text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded">
          Arriving soon
        </span>
      )}
      <VehicleVisual listing={listing} />
      <div className="p-5">
        <p className="label-caps text-brand-red">{listing.year} · {listing.body_type}</p>
        <h3 className="font-display font-bold text-xl mt-1 group-hover:text-brand-red transition-colors">
          {listing.display_name}
        </h3>
        <div className="flex items-end justify-between mt-4">
          <div>
            {pricing?.our_daily != null ? (
              <>
                <p className="text-2xl font-extrabold">
                  {fmt(pricing.our_daily)}
                  <span className="text-sm font-medium text-white/50"> /day</span>
                </p>
                {pricing.benchmark_daily != null && (
                  <p className="text-xs text-white/45 mt-0.5">
                    <span className="line-through">{fmt(pricing.benchmark_daily)} on Turo</span>
                    <span className="text-brand-red font-semibold"> — {Number(pricing.discount_pct)}% less here</span>
                  </p>
                )}
              </>
            ) : (
              <p className="text-white/50 text-sm">Enquire for rates</p>
            )}
          </div>
          <span className="text-xs uppercase tracking-wider font-semibold text-white/60 group-hover:text-white">
            View →
          </span>
        </div>
        <div className="flex gap-2 mt-4 flex-wrap">
          {[listing.seats && `${listing.seats} seats`, listing.transmission, listing.fuel_type, listing.drive_type]
            .filter(Boolean)
            .map((c) => (
              <span key={String(c)} className="text-[11px] bg-white/5 border border-white/10 rounded-full px-3 py-1 text-white/60">
                {c}
              </span>
            ))}
        </div>
        {listing.rto_available && (
          <p className="mt-4 text-[11px] uppercase tracking-wider font-semibold text-amber-400/90">
            Ownership Ladder — rental payments can count toward buying it
          </p>
        )}
      </div>
    </Link>
  )
}
