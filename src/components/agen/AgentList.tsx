'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { ShieldCheck, Home, MapPin } from 'lucide-react'

interface AgentData {
  id: string
  slug: string
  bio: string | null
  coverage_areas: string[] | null
  is_verified: boolean
  profiles: {
    full_name: string | null
    avatar_url: string | null
  } | null
  properties: { id: string }[]
}

interface Props {
  agents: AgentData[]
}

export default function AgentList({ agents }: Props) {
  if (!agents.length) {
    return (
      <div className="text-center py-16">
        <p className="text-text-secondary font-sans text-sm">Belum ada agen yang terdaftar.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {agents.map((agent, i) => {
        const name = agent.profiles?.full_name ?? 'PropVista Agent'
        const listingCount = agent.properties?.length ?? 0

        return (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.06 }}
          >
            <Link href={`/agen/${agent.slug}`} className="group block">
              <div className="bg-white rounded-sm border border-border shadow-luxury p-6 text-center hover:shadow-luxury-hover hover:-translate-y-1 transition-all duration-300">
                {/* Avatar */}
                <div className="relative w-20 h-20 rounded-full bg-bg-secondary overflow-hidden mx-auto mb-4 ring-2 ring-border group-hover:ring-accent-gold transition-all duration-300">
                  {agent.profiles?.avatar_url ? (
                    <Image src={agent.profiles.avatar_url} alt={name} fill className="object-cover" sizes="80px" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="font-serif text-2xl font-bold text-text-secondary">
                        {name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Name & verified */}
                <div className="flex items-center justify-center gap-1 mb-1">
                  <h3 className="font-sans font-semibold text-text-primary group-hover:text-accent-gold transition-colors duration-200">
                    {name}
                  </h3>
                  {agent.is_verified && <ShieldCheck className="w-4 h-4 text-status-success flex-shrink-0" />}
                </div>

                {/* Bio */}
                {agent.bio && (
                  <p className="text-xs font-sans text-text-secondary line-clamp-2 mb-3">{agent.bio}</p>
                )}

                {/* Stats */}
                <div className="flex items-center justify-center gap-4 text-xs font-sans text-text-tertiary mb-3">
                  <div className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>{listingCount} listing</span>
                  </div>
                  {agent.coverage_areas && agent.coverage_areas.length > 0 && (
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{agent.coverage_areas[0]}</span>
                    </div>
                  )}
                </div>

                {agent.is_verified && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-status-success-bg text-status-success text-xs font-sans font-medium rounded-sm">
                    <ShieldCheck className="w-3 h-3" />
                    Terverifikasi
                  </span>
                )}
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
