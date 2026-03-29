'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { BedDouble, Bath, Maximize2, MapPin, ShieldCheck } from 'lucide-react'
import { formatPrice, formatArea } from '@/lib/utils'
import type { PropertyWithImages } from '@/types/supabase'

interface PropertyCardProps {
  property: PropertyWithImages
  index?: number
}

export default function PropertyCard({ property, index = 0 }: PropertyCardProps) {
  const primaryImage = property.property_images?.find(img => img.is_primary)
    ?? property.property_images?.[0]

  const agentName = property.agents?.profiles?.full_name ?? 'PropVista Agent'
  const isVerified = property.agents?.is_verified

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08, ease: [0.4, 0, 0.2, 1] }}
    >
      <Link href={`/properti/${property.id}`} className="group block">
        <div className="bg-white rounded-sm overflow-hidden shadow-luxury border border-border transition-all duration-300 ease-luxury hover:shadow-luxury-hover hover:-translate-y-1">
          {/* Image */}
          <div className="relative h-52 overflow-hidden bg-bg-secondary">
            {primaryImage ? (
              <Image
                src={primaryImage.url}
                alt={property.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-bg-secondary">
                <span className="text-text-tertiary text-sm font-sans">Foto tidak tersedia</span>
              </div>
            )}

            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-2.5 py-1 text-xs font-medium font-sans rounded-sm ${
                property.status === 'jual'
                  ? 'bg-bg-dark text-text-on-dark'
                  : 'bg-accent-gold text-text-on-gold'
              }`}>
                {property.status === 'jual' ? 'Dijual' : 'Disewakan'}
              </span>
            </div>

            {/* Type badge */}
            <div className="absolute top-3 right-3">
              <span className="px-2.5 py-1 text-xs font-medium font-sans rounded-sm bg-white/90 text-text-secondary capitalize">
                {property.type}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Price */}
            <div className="flex items-baseline justify-between mb-2">
              <p className="font-serif text-xl font-semibold text-text-primary">
                {formatPrice(property.price)}
                {property.status === 'sewa' && (
                  <span className="text-text-tertiary text-sm font-sans font-normal">/bln</span>
                )}
              </p>
            </div>

            {/* Title */}
            <h3 className="font-sans text-sm font-medium text-text-primary line-clamp-2 mb-2 group-hover:text-accent-gold transition-colors duration-200">
              {property.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1 mb-3">
              <MapPin className="w-3.5 h-3.5 text-text-tertiary flex-shrink-0" />
              <span className="text-xs text-text-secondary font-sans line-clamp-1">
                {property.district ? `${property.district}, ` : ''}{property.city}
              </span>
            </div>

            {/* Specs */}
            {property.type !== 'tanah' && (
              <div className="flex items-center gap-3 mb-3 pt-3 border-t border-border">
                {property.bedrooms != null && (
                  <div className="flex items-center gap-1">
                    <BedDouble className="w-3.5 h-3.5 text-text-tertiary" />
                    <span className="text-xs text-text-secondary font-sans">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms != null && (
                  <div className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-text-tertiary" />
                    <span className="text-xs text-text-secondary font-sans">{property.bathrooms}</span>
                  </div>
                )}
                {property.building_area && (
                  <div className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-text-tertiary" />
                    <span className="text-xs text-text-secondary font-sans">{formatArea(property.building_area)}</span>
                  </div>
                )}
                {property.land_area && (
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-text-tertiary font-sans">LT</span>
                    <span className="text-xs text-text-secondary font-sans">{formatArea(property.land_area)}</span>
                  </div>
                )}
              </div>
            )}
            {property.type === 'tanah' && property.land_area && (
              <div className="flex items-center gap-1 mb-3 pt-3 border-t border-border">
                <Maximize2 className="w-3.5 h-3.5 text-text-tertiary" />
                <span className="text-xs text-text-secondary font-sans">{formatArea(property.land_area)}</span>
              </div>
            )}

            {/* Agent */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-bg-secondary flex items-center justify-center overflow-hidden flex-shrink-0">
                {property.agents?.profiles?.avatar_url ? (
                  <Image src={property.agents.profiles.avatar_url} alt={agentName} width={24} height={24} className="object-cover" />
                ) : (
                  <span className="text-[10px] font-medium text-text-secondary">
                    {agentName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 min-w-0">
                <span className="text-xs text-text-secondary font-sans truncate">{agentName}</span>
                {isVerified && <ShieldCheck className="w-3.5 h-3.5 text-status-success flex-shrink-0" />}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}
