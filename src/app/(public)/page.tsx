import HeroSection from '@/components/home/HeroSection'
import StatsSection from '@/components/home/StatsSection'
import PropertyTypeSection from '@/components/home/PropertyTypeSection'
import FeaturedListings from '@/components/home/FeaturedListings'
import WhyUsSection from '@/components/home/WhyUsSection'
import CTASection from '@/components/home/CTASection'
import { createClient } from '@/lib/supabase/server'
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

    if (error || !data) return []
    return data as unknown as PropertyWithImages[]
  } catch {
    return []
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
      <WhyUsSection />
      <CTASection />
    </>
  )
}
