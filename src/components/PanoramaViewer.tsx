import { useEffect, useRef } from 'react'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Floor, Poi } from '../types'
import PanoramaNavigationOverlay from './PanoramaNavigationOverlay'

// Tous les fichiers de src/panoramas sont inclus automatiquement au build
const panoramas = import.meta.glob('../panoramas/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

interface Props {
  title: string
  url: string
  onClose: () => void
  onPrev?: () => void
  onNext?: () => void
  floor?: Floor
  activePoiId?: string
  onSelect?: (poi: Poi) => void
}

export default function PanoramaViewer({ title, url, onClose, onPrev, onNext, floor, activePoiId, onSelect }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let viewer: Viewer | undefined
    const frame = requestAnimationFrame(() => {
      if (!container.current) return
      viewer = new Viewer({
        container: container.current,
        panorama: panoramas[url.replace(/^\/src\//, '../')] ?? url,
        navbar: ['zoom', 'move', 'fullscreen'],
        defaultZoomLvl: 30,
      })
    })
    return () => {
      cancelAnimationFrame(frame)
      viewer?.destroy()
    }
  }, [url])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <div className="overlay" role="dialog" aria-modal="true" aria-label={title}>
      <div ref={container} className="viewer" />
      {title?.trim() && <div className="viewer-title">{title}</div>}
      {floor && activePoiId && onSelect && (
        <PanoramaNavigationOverlay floor={floor} activePoiId={activePoiId} onSelect={onSelect} />
      )}
      <button className="close-btn" onClick={onClose} aria-label="Fermer">
        <X size={24} />
      </button>
      {onPrev && (
        <button className="nav-btn prev" onClick={onPrev} aria-label="Panorama précédent">
          <ChevronLeft size={28} />
        </button>
      )}
      {onNext && (
        <button className="nav-btn next" onClick={onNext} aria-label="Panorama suivant">
          <ChevronRight size={28} />
        </button>
      )}
    </div>
  )
}
