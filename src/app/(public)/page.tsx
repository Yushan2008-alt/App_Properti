import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import PropertyTypeSection from '@/components/home/PropertyTypeSection'
import FeaturedListings from '@/components/home/FeaturedListings'
import HeatmapSection from '@/components/home/HeatmapSection'
import WhyUsSection from '@/components/home/WhyUsSection'
import CTASection from '@/components/home/CTASection'
import { createClient } from '@/lib/supabase/server'
import { DEMO_PROPERTIES } from '@/lib/mock-data'
import type { PropertyWithImages } from '@/types/supabase'

async function getFeaturedProperties(): Promise<PropertyWithImages[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('properties')
      .select(`
        *,
        property_images(*),
        agents(
          *,
          profiles(*)
        )
      `)
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .limit(8)

    if (error || !data || data.length === 0) return DEMO_PROPERTIES
    return data as unknown as PropertyWithImages[]
  } catch {
    return DEMO_PROPERTIES
  }
}

export default async function HomePage() {
  const featuredProperties = await getFeaturedProperties()

  return (
    <>
      <HeroSection />
      <StatsSection />
      <PropertyTypeSection />
      <FeaturedListings properties={featuredProperties} />
      <HeatmapSection />
      <WhyUsSection />
      <CTASection />
    </>
  )
}
