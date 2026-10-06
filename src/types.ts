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
  floors: Floor[]
}
