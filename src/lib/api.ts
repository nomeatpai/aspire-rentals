import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://ldemvsuckwyqpmyzljxa.supabase.co'
const ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkZW12c3Vja3d5cXBteXpsanhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM0Nzg1MDcsImV4cCI6MjA4OTA1NDUwN30.lssqzwV3cxmtPybVAwWwmPxDBgwF2vtGxigLx-5TGKQ'

export const supabase = createClient(SUPABASE_URL, ANON_KEY, {
  db: { schema: 'rentals' },
})

export interface Listing {
  id: string
  slug: string
  display_name: string
  make: string
  model: string
  variant: string | null
  year: number | null
  collection: 'luxury' | 'fleet'
  seats: number | null
  transmission: string | null
  fuel_type: string | null
  body_type: string | null
  drive_type: string | null
  description: string | null
  highlights: string[]
  hero_image_url: string | null
  gallery: string[]
  location: string
  status: string
  min_days: number
  bond_aud: number | null
  rto_available: boolean
  rto_term_weeks: number | null
  buyout_price: number | null
  sort_order: number
}

export interface Pricing {
  listing_id: string
  slug: string
  benchmark_daily: number | null
  benchmark_source: string | null
  benchmark_at: string | null
  discount_pct: number
  our_daily: number | null
  our_weekly: number | null
  our_monthly: number | null
}

export async function fetchCatalogue(): Promise<{ listings: Listing[]; pricing: Map<string, Pricing> }> {
  const [l, p] = await Promise.all([
    supabase.from('listings').select('*').in('status', ['live', 'coming_soon']).order('sort_order'),
    supabase.from('v_live_pricing').select('*'),
  ])
  const pricing = new Map<string, Pricing>()
  for (const row of (p.data as Pricing[]) || []) pricing.set(row.listing_id, row)
  return { listings: (l.data as Listing[]) || [], pricing }
}

export async function fetchListing(slug: string): Promise<{ listing: Listing | null; pricing: Pricing | null }> {
  const { data } = await supabase.from('listings').select('*').eq('slug', slug).maybeSingle()
  if (!data) return { listing: null, pricing: null }
  const { data: p } = await supabase.from('v_live_pricing').select('*').eq('listing_id', data.id).maybeSingle()
  return { listing: data as Listing, pricing: p as Pricing | null }
}

const FN_BASE = `${SUPABASE_URL}/functions/v1/rentals-api`

async function callApi(action: string, body: Record<string, unknown>) {
  const res = await fetch(`${FN_BASE}/${action}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${ANON_KEY}` },
    body: JSON.stringify(body),
  })
  return res.json()
}

export interface Quote {
  days: number
  daily: number
  subtotal: number
  delivery_fee: number
  total: number
  benchmark: number
  discount_pct: number
  delivery_radius_km: number
  available: boolean
  error?: string
  min_days?: number
}

export const getQuote = (listing_id: string, start_date: string, end_date: string, delivery_option = 'pickup'): Promise<Quote> =>
  callApi('quote', { listing_id, start_date, end_date, delivery_option })

export const createBooking = (payload: Record<string, unknown>) => callApi('book', payload)

export const createEnquiry = (payload: Record<string, unknown>) => callApi('enquire', payload)

export const fmt = (n: number | null | undefined) =>
  n == null ? '—' : new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', maximumFractionDigits: 0 }).format(Number(n))
