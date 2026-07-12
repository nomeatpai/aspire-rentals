import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase, fmt } from '../lib/api'

interface TripInfo {
  ref: string
  status: string
  start_date: string
  end_date: string
  days: number
  pickup_time: string | null
  delivery_option: string
  total: number
  delivery_fee: number
  vehicle_name: string
  vehicle_image: string | null
  customer_first_name: string
}

const STAGES = [
  ['awaiting_review', 'Request received'],
  ['confirmed', 'Confirmed'],
  ['active', 'On trip'],
  ['closed', 'Returned'],
] as const

function stageIndex(t: TripInfo) {
  const today = new Date().toISOString().slice(0, 10)
  if (t.status === 'awaiting_review' || t.status === 'pending_payment') return 0
  if (t.status === 'declined' || t.status === 'cancelled') return 0
  if (today < t.start_date) return 1
  if (today <= t.end_date) return 2
  return 3
}

function PhotoUploader({ tripRef, phase }: { tripRef: string; phase: 'checkin' | 'checkout' }) {
  const [files, setFiles] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)
  const input = useRef<HTMLInputElement>(null)

  useEffect(() => {
    supabase.storage.from('trip-photos').list(`${tripRef}/${phase}`).then(({ data }) => {
      if (data) setFiles(data.filter((f) => f.name !== '.emptyFolderPlaceholder').map((f) => f.name))
    })
  }, [tripRef, phase])

  const upload = async (list: FileList | null) => {
    if (!list?.length) return
    setUploading(true)
    for (const file of Array.from(list)) {
      const name = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
      const { error } = await supabase.storage.from('trip-photos').upload(`${tripRef}/${phase}/${name}`, file)
      if (!error) setFiles((f) => [...f, name])
    }
    setUploading(false)
  }

  const publicUrl = (name: string) =>
    supabase.storage.from('trip-photos').getPublicUrl(`${tripRef}/${phase}/${name}`).data.publicUrl

  return (
    <div className="rounded-lg border border-white/15 bg-white/[0.03] p-5">
      <p className="font-bold">{phase === 'checkin' ? 'Check-in photos' : 'Check-out photos'}</p>
      <p className="text-xs text-white/50 mt-1">
        {phase === 'checkin'
          ? 'All four corners + odometer at pickup. Protects your bond.'
          : 'Same shots at return — fuel gauge included.'}
      </p>
      {files.length > 0 && (
        <div className="grid grid-cols-4 gap-2 mt-3">
          {files.map((f) => (
            <img key={f} src={publicUrl(f)} alt="" className="h-16 w-full object-cover rounded" />
          ))}
        </div>
      )}
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => upload(e.target.files)} />
      <button type="button" onClick={() => input.current?.click()} disabled={uploading} className="btn-outline mt-4 !py-2.5 !px-5 text-xs w-full">
        {uploading ? 'Uploading…' : files.length ? 'Add more photos' : 'Upload photos'}
      </button>
    </div>
  )
}

export default function Trip() {
  const { ref } = useParams()
  const [trip, setTrip] = useState<TripInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!ref) return
    supabase.rpc('get_trip', { p_ref: ref }).then(({ data }) => {
      setTrip((data as TripInfo[])?.[0] ?? null)
      setLoading(false)
    })
  }, [ref])

  if (loading) return <main className="max-w-3xl mx-auto px-5 py-24 text-white/50">Loading your trip…</main>
  if (!trip)
    return (
      <main className="max-w-3xl mx-auto px-5 py-24">
        <p>We couldn't find that trip reference.</p>
        <Link to="/" className="text-brand-red">← Back to the fleet</Link>
      </main>
    )

  const idx = stageIndex(trip)
  const delivery =
    trip.delivery_option === 'delivery_airport'
      ? 'Delivered to Sydney Airport'
      : trip.delivery_option === 'delivery_local'
        ? 'Delivered to you'
        : 'Pickup — Kingsgrove'

  return (
    <main className="max-w-3xl mx-auto px-5 py-12">
      <p className="label-caps text-brand-red">Trip {trip.ref}</p>
      <h1 className="font-display font-black text-3xl mt-1">{trip.vehicle_name}</h1>
      <p className="text-white/60 mt-2">
        {trip.start_date} → {trip.end_date} · {trip.days} days · {delivery}
        {trip.pickup_time ? ` · ${trip.pickup_time}` : ''}
      </p>

      {trip.vehicle_image && (
        <img src={trip.vehicle_image} alt={trip.vehicle_name} className="w-full h-56 object-cover rounded-lg border border-white/10 mt-6" />
      )}

      {/* Journey timeline */}
      <div className="flex items-center mt-8">
        {STAGES.map(([, label], i) => (
          <div key={label} className="flex-1 flex items-center">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${i <= idx ? 'bg-brand-red text-white' : 'bg-white/10 text-white/40'}`}>
                {i < idx ? '✓' : i + 1}
              </div>
              <span className={`text-[10px] uppercase tracking-wider mt-2 ${i <= idx ? 'text-white' : 'text-white/40'}`}>{label}</span>
            </div>
            {i < STAGES.length - 1 && <div className={`h-0.5 flex-1 -mt-5 ${i < idx ? 'bg-brand-red' : 'bg-white/10'}`} />}
          </div>
        ))}
      </div>

      <div className="rounded bg-white/5 p-4 text-sm mt-8 space-y-1">
        <div className="flex justify-between">
          <span className="text-white/60">Trip total</span>
          <span className="font-bold">{fmt(trip.total)}</span>
        </div>
        {Number(trip.delivery_fee) > 0 && (
          <div className="flex justify-between text-xs text-white/45">
            <span>Includes delivery</span>
            <span>{fmt(trip.delivery_fee)}</span>
          </div>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mt-8">
        <PhotoUploader tripRef={trip.ref} phase="checkin" />
        <PhotoUploader tripRef={trip.ref} phase="checkout" />
      </div>

      <div className="mt-8 rounded-lg border border-white/10 bg-white/[0.02] p-5 text-sm text-white/65 leading-relaxed">
        <p className="font-bold text-white mb-2">Need anything?</p>
        Reply to any of our emails, or text the fleet line — extensions, early returns and questions are usually
        sorted in minutes. Loved the car? Ask about the <Link to="/rent-to-own" className="text-brand-red">Ownership Ladder</Link>.
      </div>
    </main>
  )
}
