'use client'

import dynamic from 'next/dynamic'
import type { MapProperty } from './PropertyMapFull'

const PropertyMapFull = dynamic(
  () => import('./PropertyMapFull'),
  { ssr: false }
)

interface Props {
  properties: MapProperty[]
  height?: string
}

export default function PropertyMapClient({ properties, height }: Props) {
  return <PropertyMapFull properties={properties} height={height} />
}
