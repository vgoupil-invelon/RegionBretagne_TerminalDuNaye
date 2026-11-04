import { useEffect, useLayoutEffect, useState } from 'react'

const STORAGE_KEY = 'hasSeenVisitsTooltip'
const MOBILE_QUERY = '(max-width: 720px)'
const DESKTOP_TARGET = '[data-visits-target]'
const MOBILE_TARGET = '.menu-btn'
const GAP = 14
const EDGE_MARGIN = 8
const ARROW_SIZE = 8

type Placement = 'right' | 'bottom'

interface Position {
  top: number
  left?: number
  right?: number
  arrowRight?: number
}

function hasSeen(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => window.matchMedia(MOBILE_QUERY).matches)
  useEffect(() => {
    const mql = window.matchMedia(MOBILE_QUERY)
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    setIsMobile(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return isMobile
}

export default function VisitsOnboardingTooltip() {
  const [visible, setVisible] = useState<boolean>(() => !hasSeen())
  const [position, setPosition] = useState<Position | null>(null)
  const isMobile = useIsMobile()
  const placement: Placement = isMobile ? 'bottom' : 'right'
  const message = isMobile ? 'Ouvrez le menu pour accéder à vos visites' : 'Découvrez et parcourez vos visites ici'

  useLayoutEffect(() => {
    if (!visible) return
    const update = () => {
      const target = document.querySelector<HTMLElement>(isMobile ? MOBILE_TARGET : DESKTOP_TARGET)
      if (!target) {
        setPosition(null)
        return
      }
      const r = target.getBoundingClientRect()
      if (placement === 'right') {
        setPosition({ top: r.top + r.height / 2, left: r.right + GAP })
      } else {
        const right = Math.max(EDGE_MARGIN, window.innerWidth - r.right)
        const arrowRight = window.innerWidth - (r.left + r.width / 2) - right - ARROW_SIZE
        setPosition({ top: r.bottom + GAP, right, arrowRight })
      }
    }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => {
      window.removeEventListener('resize', update)
      window.removeEventListener('scroll', update, true)
    }
  }, [visible, isMobile, placement])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(STORAGE_KEY, 'true')
    } catch {
      // storage unavailable: tooltip simply won't persist its dismissal
    }
  }

  if (!visible || !position) return null

  return (
    <div
      className={`onboarding-tooltip ${placement}`}
      role="tooltip"
      aria-label={message}
      style={{ top: position.top, left: position.left, right: position.right }}
    >
      <span
        className="onboarding-arrow"
        aria-hidden="true"
        style={position.arrowRight !== undefined ? { right: position.arrowRight, left: 'auto', marginLeft: 0 } : undefined}
      />
      <p>{message}</p>
      <button type="button" onClick={dismiss} aria-label="Fermer l'astuce" autoFocus>
        Compris
      </button>
    </div>
  )
}
