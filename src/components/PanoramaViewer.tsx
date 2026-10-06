import { useEffect, useRef } from 'react'
import { Viewer } from '@photo-sphere-viewer/core'
import '@photo-sphere-viewer/core/index.css'
import { X } from 'lucide-react'
import sphere from '../panoramas/sphere.jpg'

interface Props {
  title: string
  url: string
  onClose: () => void
}

export default function PanoramaViewer({ title, url, onClose }: Props) {
  const container = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let viewer: Viewer | undefined
    const frame = requestAnimationFrame(() => {
      if (!container.current) return
      viewer = new Viewer({
        container: container.current,
        panorama: url === '/src/panoramas/sphere.jpg' ? sphere : url,
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
      <div className="viewer-title">{title}</div>
      <button className="close-btn" onClick={onClose} aria-label="Fermer">
        <X size={24} />
      </button>
    </div>
  )
}
