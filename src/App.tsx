import { useEffect, useState } from 'react'
import { Menu, MapPin, X } from 'lucide-react'
import building from './config/building.json'
import type { AerialPoi, Building, Poi } from './types'
import PanoramaViewer from './components/PanoramaViewer'
import POILegend from './components/POILegend'
import { getLegendItems, type LegendPoi } from './components/legend'

// Tous les fichiers de src/floors sont inclus automatiquement au build
const floorImages = import.meta.glob('./floors/*.{jpg,jpeg,png,webp,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const resolveFloorImage = (path: string) =>
  floorImages[path.replace(/^\/src\//, './')] ?? path

const photoImages = import.meta.glob('./panoramas/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>

const resolveImage = (path: string) =>
  photoImages[path.replace(/^\/src\//, './')] ?? resolveFloorImage(path)

const data = building as Building

function useIsPortrait() {
  const query = '(orientation: portrait)'
  const [portrait, setPortrait] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setPortrait(mq.matches)
    onChange()
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return portrait
}

export default function App() {
  const [started, setStarted] = useState(false)
  const [floorId, setFloorId] = useState<string | undefined>(data.aerialView.id)
  const [aerialPoi, setAerialPoi] = useState<AerialPoi | null>(null)
  const [activePoi, setActivePoi] = useState<Poi | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const isPortrait = useIsPortrait()
  const isAerial = floorId === data.aerialView.id
  const floor = data.floors.find((f) => f.id === floorId)
  const panoramaPois = floor?.pois.filter((p) => p.panoramaUrl) ?? []
  const activeIndex = activePoi ? panoramaPois.findIndex((p) => p.id === activePoi.id) : -1
  const prevPoi = activeIndex > 0 ? panoramaPois[activeIndex - 1] : null
  const nextPoi = activeIndex >= 0 && activeIndex < panoramaPois.length - 1 ? panoramaPois[activeIndex + 1] : null

  const aerialLegend = getLegendItems(data.aerialView.pois)
  const floorLegend = floor ? getLegendItems(floor.pois) : []
  const legendLabel = (items: LegendPoi[], id: string, hideTitles = isPortrait) =>
    hideTitles ? items.find((i) => i.id === id)?.label : undefined

  if (!started) {
    return (
      <div className="landing" style={{ backgroundImage: `url(${resolveFloorImage(data.landingImage)})` }}>
        <div className="landing-content">
          <h1>{data.projectName}</h1>
          <button className="start-btn" onClick={() => setStarted(true)}>
            Commencer la visite
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <header className="header">
        <div className="logos">
          {data.partnerLogos.map((l) => (
            <img key={l.name} src={resolveFloorImage(l.image)} alt={l.name} />
          ))}
        </div>
        <h1>{data.projectName}</h1>
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Afficher/masquer les étages"
          aria-expanded={sidebarOpen}
        >
          <Menu size={22} />
        </button>
      </header>
      <div className="body">
        <nav className={`sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Étages">
          <ul>
            {[data.aerialView, ...data.floors].map((f) => (
              <li key={f.id}>
                <button
                  className={f.id === floorId ? 'active' : ''}
                  onClick={() => {
                    setFloorId(f.id)
                    setSidebarOpen(false)
                  }}
                >
                  {f.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <main className="plan-area">
          {isAerial && (
            <div className="plan">
              <img src={resolveFloorImage(data.aerialView.image)} alt={data.aerialView.name} draggable={false} />
              {data.aerialView.pois.map((p) => (
                <button
                  key={p.id}
                  className={`poi${p.image ? '' : ' static'}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onClick={() => p.image && setAerialPoi(p)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  disabled={!p.image}
                  aria-label={p.title}
                >
                  {p.image ? <MapPin size={32} fill="currentColor" /> : <span className="poi-dot" />}
                  {p.number !== undefined && <span className="poi-number">{p.number}</span>}
                  {legendLabel(aerialLegend, p.id, true) !== undefined && p.number === undefined && (
                    <span className="poi-number">{legendLabel(aerialLegend, p.id, true)}</span>
                  )}
                  {p.title?.trim() && legendLabel(aerialLegend, p.id, true) === undefined && (
                    <span className={`tooltip${p.showTitle ? ' always-visible' : ''}`}>{p.title}</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {isAerial && (
            <POILegend
              items={aerialLegend}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={(id) => {
                const p = data.aerialView.pois.find((x) => x.id === id)
                if (p?.image) setAerialPoi(p)
              }}
            />
          )}
          {floor && (
            <div className="plan">
              <img src={resolveFloorImage(floor.planImage)} alt={`Plan : ${floor.name}`} draggable={false} />
              {floor.pois.map((p) => (
                <button
                  key={p.id}
                  className={`poi${p.panoramaUrl ? '' : ' static'}`}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onClick={() => p.panoramaUrl && setActivePoi(p)}
                  onMouseEnter={() => setHoveredId(p.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  disabled={!p.panoramaUrl}
                  aria-label={p.title}
                >
                  {p.panoramaUrl ? <MapPin size={32} fill="currentColor" /> : <span className="poi-dot" />}
                  {p.number !== undefined && <span className="poi-number">{p.number}</span>}
                  {legendLabel(floorLegend, p.id) !== undefined && p.number === undefined && (
                    <span className="poi-number">{legendLabel(floorLegend, p.id)}</span>
                  )}
                  {p.title?.trim() && legendLabel(floorLegend, p.id) === undefined && (
                    <span className={`tooltip${p.showTitle ? ' always-visible' : ''}`}>{p.title}</span>
                  )}
                </button>
              ))}
            </div>
          )}
          {floor && (
            <POILegend
              items={floorLegend}
              hoveredId={hoveredId}
              onHover={setHoveredId}
              onSelect={(id) => {
                const p = floor.pois.find((x) => x.id === id)
                if (p?.panoramaUrl) setActivePoi(p)
              }}
            />
          )}
        </main>
      </div>
      {aerialPoi?.image && (
        <div className="overlay photo-overlay" role="dialog" aria-modal="true" aria-label={aerialPoi.title}>
          <img src={resolveImage(aerialPoi.image)} alt={aerialPoi.title} />
          {aerialPoi.title?.trim() && <div className="viewer-title">{aerialPoi.title}</div>}
          <button className="close-btn" onClick={() => setAerialPoi(null)} aria-label="Fermer">
            <X size={24} />
          </button>
        </div>
      )}
      {activePoi?.panoramaUrl && (
        <PanoramaViewer
          title={activePoi.title}
          url={activePoi.panoramaUrl}
          floor={floor}
          activePoiId={activePoi.id}
          onSelect={(poi) => poi.panoramaUrl && setActivePoi(poi)}
          onClose={() => setActivePoi(null)}
          onPrev={prevPoi ? () => setActivePoi(prevPoi) : undefined}
          onNext={nextPoi ? () => setActivePoi(nextPoi) : undefined}
        />
      )}
    </div>
  )
}
