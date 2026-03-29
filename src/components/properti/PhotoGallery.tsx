'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react'
import type { PropertyImage } from '@/types/supabase'

interface PhotoGalleryProps {
  images: PropertyImage[]
  title: string
}

export default function PhotoGallery({ images, title }: PhotoGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  if (!images.length) {
    return (
      <div className="h-72 bg-bg-secondary rounded-sm flex items-center justify-center">
        <span className="text-text-tertiary font-sans text-sm">Tidak ada foto</span>
      </div>
    )
  }

  function prev() {
    setActiveIndex(i => (i - 1 + images.length) % images.length)
  }
  function next() {
    setActiveIndex(i => (i + 1) % images.length)
  }

  return (
    <>
      <div className="rounded-sm overflow-hidden shadow-luxury">
        {/* Main image */}
        <div className="relative h-72 lg:h-[480px] bg-bg-secondary group cursor-pointer" onClick={() => setLightbox(true)}>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0"
            >
              <Image
                src={images[activeIndex].url}
                alt={`${title} - foto ${activeIndex + 1}`}
                fill
                className="object-cover"
                priority={activeIndex === 0}
                sizes="(max-width: 768px) 100vw, 70vw"
              />
            </motion.div>
          </AnimatePresence>

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />

          {/* Zoom icon */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="w-8 h-8 bg-white/90 rounded-sm flex items-center justify-center">
              <ZoomIn className="w-4 h-4 text-text-primary" />
            </div>
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/60 text-white text-xs font-sans rounded-sm">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Nav arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={e => { e.stopPropagation(); prev() }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={e => { e.stopPropagation(); next() }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-white"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 p-3 bg-white border-t border-border overflow-x-auto">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setActiveIndex(i)}
                className={`relative flex-shrink-0 w-16 h-12 rounded-sm overflow-hidden border-2 transition-all duration-200 ${
                  i === activeIndex ? 'border-accent-gold' : 'border-transparent hover:border-accent-gold/50'
                }`}
              >
                <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
            onClick={() => setLightbox(false)}
          >
            <button
              onClick={() => setLightbox(false)}
              className="absolute top-4 right-4 w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative w-full max-w-5xl max-h-[90vh] mx-4" onClick={e => e.stopPropagation()}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="relative aspect-video"
                >
                  <Image
                    src={images[activeIndex].url}
                    alt={`${title} - foto ${activeIndex + 1}`}
                    fill
                    className="object-contain"
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button onClick={prev} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-12 w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={next} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 w-10 h-10 bg-white/10 rounded-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className="text-center text-white/50 text-sm font-sans mt-3">
                {activeIndex + 1} / {images.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
