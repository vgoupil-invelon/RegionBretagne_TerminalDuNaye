import { useState } from 'react'
import { Menu, MapPin, X } from 'lucide-react'
import building from './config/building.json'
import type { AerialPoi, Building, Poi } from './types'
import PanoramaViewer from './components/PanoramaViewer'

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

export default function App() {
  const [started, setStarted] = useState(false)
  const [floorId, setFloorId] = useState<string | undefined>(data.aerialView.id)
  const [aerialPoi, setAerialPoi] = useState<AerialPoi | null>(null)
  const [activePoi, setActivePoi] = useState<Poi | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const isAerial = floorId === data.aerialView.id
  const floor = data.floors.find((f) => f.id === floorId)
  const activeIndex = floor && activePoi ? floor.pois.findIndex((p) => p.id === activePoi.id) : -1
  const prevPoi = activeIndex > 0 ? floor!.pois[activeIndex - 1] : null
  const nextPoi = activeIndex >= 0 && floor && activeIndex < floor.pois.length - 1 ? floor.pois[activeIndex + 1] : null

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
        <button
          className="menu-btn"
          onClick={() => setSidebarOpen((o) => !o)}
          aria-label="Afficher/masquer les étages"
          aria-expanded={sidebarOpen}
        >
          <Menu size={22} />
        </button>
        <h1>{data.projectName}</h1>
        {<div className="logos">
          {data.partnerLogos.map((l) => (
            <img key={l.name} src={l.url} alt={l.name} />
          ))}
        </div>}
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
                  className="poi"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onClick={() => setAerialPoi(p)}
                  aria-label={p.title}
                >
                  <MapPin size={32} fill="currentColor" />
                  {p.title?.trim() && <span className="tooltip">{p.title}</span>}
                </button>
              ))}
            </div>
          )}
          {floor && (
            <div className="plan">
              <img src={resolveFloorImage(floor.planImage)} alt={`Plan : ${floor.name}`} draggable={false} />
              {floor.pois.map((p) => (
                <button
                  key={p.id}
                  className="poi"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onClick={() => setActivePoi(p)}
                  aria-label={p.title}
                >
                  <MapPin size={32} fill="currentColor" />
                  {p.title?.trim() && <span className="tooltip">{p.title}</span>}
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
      {aerialPoi && (
        <div className="overlay photo-overlay" role="dialog" aria-modal="true" aria-label={aerialPoi.title}>
          <img src={resolveImage(aerialPoi.image)} alt={aerialPoi.title} />
          {aerialPoi.title?.trim() && <div className="viewer-title">{aerialPoi.title}</div>}
          <button className="close-btn" onClick={() => setAerialPoi(null)} aria-label="Fermer">
            <X size={24} />
          </button>
        </div>
      )}
      {activePoi && (
        <PanoramaViewer
          title={activePoi.title}
          url={activePoi.panoramaUrl}
          onClose={() => setActivePoi(null)}
          onPrev={prevPoi ? () => setActivePoi(prevPoi) : undefined}
          onNext={nextPoi ? () => setActivePoi(nextPoi) : undefined}
        />
      )}
    </div>
  )
}
