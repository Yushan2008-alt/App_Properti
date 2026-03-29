import { Suspense } from 'react'
import { Search } from 'lucide-react'
import FilterSidebar from '@/components/properti/FilterSidebar'
import PropertyCard from '@/components/ui/PropertyCard'
import { createClient } from '@/lib/supabase/server'
import type { PropertyWithImages } from '@/types/supabase'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cari Properti',
  description: 'Temukan ribuan properti terbaik di Indonesia — rumah, apartemen, ruko, tanah, dan villa dari agen terverifikasi.',
}

interface PageProps {
  searchParams: Promise<{
    q?: string
    status?: string
    type?: string
    city?: string
    minPrice?: string
    maxPrice?: string
    bedrooms?: string
    sort?: string
  }>
}

async function getProperties(searchParams: Awaited<PageProps['searchParams']>): Promise<PropertyWithImages[]> {
  try {
    const supabase = await createClient()
    let query = supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        agents(*, profiles(*))
      `)
      .eq('is_published', true)

    if (searchParams.q) {
      query = query.or(`title.ilike.%${searchParams.q}%,city.ilike.%${searchParams.q}%,district.ilike.%${searchParams.q}%`)
    }
    if (searchParams.status) query = query.eq('status', searchParams.status)
    if (searchParams.type) query = query.eq('type', searchParams.type)
    if (searchParams.city) query = query.ilike('city', `%${searchParams.city}%`)
    if (searchParams.minPrice) query = query.gte('price', Number(searchParams.minPrice))
    if (searchParams.maxPrice) query = query.lte('price', Number(searchParams.maxPrice))
    if (searchParams.bedrooms) query = query.gte('bedrooms', Number(searchParams.bedrooms))

    const sort = searchParams.sort ?? 'newest'
    if (sort === 'price_asc') query = query.order('price', { ascending: true })
    else if (sort === 'price_desc') query = query.order('price', { ascending: false })
    else query = query.order('created_at', { ascending: false })

    const { data, error } = await query.limit(48)
    if (error || !data) return []
    return data as unknown as PropertyWithImages[]
  } catch {
    return []
  }
}

export default async function PropertiPage({ searchParams }: PageProps) {
  const params = await searchParams
  const properties = await getProperties(params)

  return (
    <div className="pt-20 min-h-screen bg-bg-primary">
      {/* Header */}
      <div className="bg-bg-secondary border-b border-border py-8">
        <div className="container-luxury">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl lg:text-3xl font-bold text-text-primary">
                {params.q ? `Hasil pencarian "${params.q}"` : 'Semua Properti'}
              </h1>
              <p className="text-sm text-text-secondary font-sans mt-1">
                {properties.length} properti ditemukan
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-text-secondary font-sans">Urutkan:</span>
              <select
                defaultValue={params.sort ?? 'newest'}
                className="text-sm font-sans border border-border rounded-sm px-3 py-2 bg-white focus:outline-none focus:border-accent-gold transition-all duration-200"
              >
                <option value="newest">Terbaru</option>
                <option value="price_asc">Harga: Terendah</option>
                <option value="price_desc">Harga: Tertinggi</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container-luxury py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="w-72 flex-shrink-0">
            <Suspense>
              <FilterSidebar />
            </Suspense>
          </aside>

          {/* Results */}
          <div className="flex-1 min-w-0">
            {properties.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mb-4">
                  <Search className="w-8 h-8 text-text-tertiary" />
                </div>
                <h3 className="font-sans font-semibold text-text-primary mb-2">
                  Tidak ada properti ditemukan
                </h3>
                <p className="text-sm text-text-secondary font-sans max-w-sm">
                  Coba ubah kata kunci atau filter pencarian Anda
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {properties.map((property, i) => (
                  <PropertyCard key={property.id} property={property} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
