'use client'

import dynamic from 'next/dynamic'

const MarketPriceHeatmap = dynamic(
  () => import('@/components/map/MarketPriceHeatmap'),
  { ssr: false }
)

interface Props {
  height?: string
}

export default function MarketPriceHeatmapClient({ height }: Props) {
  return <MarketPriceHeatmap height={height} showLegend showControls />
}
