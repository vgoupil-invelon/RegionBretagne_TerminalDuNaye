import { useState } from 'react'
import { Menu, MapPin } from 'lucide-react'
import building from './config/building.json'
import type { Building, Poi } from './types'
import PanoramaViewer from './components/PanoramaViewer'

const data = building as Building

export default function App() {
  const [floorId, setFloorId] = useState(data.floors[0]?.id)
  const [activePoi, setActivePoi] = useState<Poi | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const floor = data.floors.find((f) => f.id === floorId)

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
        <div className="logos">
          {data.partnerLogos.map((l) => (
            <img key={l.name} src={l.url} alt={l.name} />
          ))}
        </div>
      </header>
      <div className="body">
        <nav className={`sidebar${sidebarOpen ? ' open' : ''}`} aria-label="Étages">
          <ul>
            {data.floors.map((f) => (
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
          {floor && (
            <div className="plan">
              <img src={floor.planImage} alt={`Plan : ${floor.name}`} draggable={false} />
              {floor.pois.map((p) => (
                <button
                  key={p.id}
                  className="poi"
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  onClick={() => setActivePoi(p)}
                  aria-label={p.title}
                >
                  <MapPin size={32} fill="currentColor" />
                  <span className="tooltip">{p.title}</span>
                </button>
              ))}
            </div>
          )}
        </main>
      </div>
      {activePoi && (
        <PanoramaViewer
          title={activePoi.title}
          url={activePoi.panoramaUrl}
          onClose={() => setActivePoi(null)}
        />
      )}
    </div>
  )
}
