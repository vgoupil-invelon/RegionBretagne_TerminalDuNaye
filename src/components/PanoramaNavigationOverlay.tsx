import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import type { Floor, Poi } from '../types'

interface Props {
  floor: Floor
  activePoiId: string
  onSelect: (poi: Poi) => void
}

export default function PanoramaNavigationOverlay({ floor, activePoiId, onSelect }: Props) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <nav className="pano-nav" aria-label={`Panoramas : ${floor.name}`}>
      <button
        className="pano-nav-toggle"
        onClick={() => setIsCollapsed((c) => !c)}
        aria-expanded={!isCollapsed}
      >
        <span>{floor.name}</span>
        {isCollapsed ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
      </button>
      {!isCollapsed && (
        <ul>
          {floor.pois.filter((p) => p.panoramaUrl).map((p, i) => (
            <li key={p.id}>
              <button
                className={p.id === activePoiId ? 'active' : ''}
                aria-current={p.id === activePoiId ? 'true' : undefined}
                onClick={() => onSelect(p)}
              >
                {p.number ?? i + 1}. {p.title?.trim() || `Panorama ${i + 1}`}
              </button>
            </li>
          ))}
        </ul>
      )}
    </nav>
  )
}
