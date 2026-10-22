import type { LegendPoi } from './legend'

interface Props {
  items: LegendPoi[]
  hoveredId: string | null
  onHover: (id: string | null) => void
  onSelect: (id: string) => void
}

export default function POILegend({ items, hoveredId, onHover, onSelect }: Props) {
  if (items.length === 0) return null
  return (
    <ul className="poi-legend" aria-label="Légende des points d'intérêt">
      {items.map((i) => (
        <li key={i.id}>
          <button
            className={hoveredId === i.id && i.interactive ? 'hovered' : ''}
            disabled={!i.interactive}
            onClick={() => i.interactive && onSelect(i.id)}
            onMouseEnter={() => onHover(i.id)}
            onMouseLeave={() => onHover(null)}
            onFocus={() => onHover(i.id)}
            onBlur={() => onHover(null)}
          >
            <span className="poi-legend-badge">{i.label}</span>
            {i.title}
          </button>
        </li>
      ))}
    </ul>
  )
}
