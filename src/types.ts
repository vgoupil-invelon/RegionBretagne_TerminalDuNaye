export interface Poi {
  id: string
  title: string
  number?: number | string
  x: number
  y: number
  panoramaUrl?: string
  showTitle?: boolean
}

export interface Floor {
  id: string
  name: string
  planImage: string
  pois: Poi[]
}

export interface Building {
  projectName: string
  partnerLogos: { name: string; image: string }[]
  landingImage: string
  aerialView: AerialView
  floors: Floor[]
}

export interface AerialPoi {
  id: string
  title: string
  number?: number | string
  x: number
  y: number
  image?: string
  showTitle?: boolean
}

export interface AerialView {
  id: string
  name: string
  image: string
  pois: AerialPoi[]
}
