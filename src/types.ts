export interface Poi {
  id: string
  title: string
  x: number
  y: number
  panoramaUrl: string
}

export interface Floor {
  id: string
  name: string
  planImage: string
  pois: Poi[]
}

export interface Building {
  projectName: string
  partnerLogos: { name: string; url: string }[]
  landingImage: string
  aerialView: AerialView
  floors: Floor[]
}

export interface AerialPoi {
  id: string
  title: string
  x: number
  y: number
  image: string
}

export interface AerialView {
  id: string
  name: string
  image: string
  pois: AerialPoi[]
}
