export interface LegendPoi {
  id: string
  label: string
  title: string
  interactive: boolean
}

export function getLegendItems(
  pois: { id: string; title: string; number?: number | string; showTitle?: boolean; image?: string; panoramaUrl?: string }[],
): LegendPoi[] {
  let n = 0
  return pois
    .filter((p) => p.showTitle === true && p.title?.trim())
    .map((p) => {
      n += 1
      return { id: p.id, title: p.title, label: String(p.number ?? n), interactive: Boolean(p.image || p.panoramaUrl) }
    })
}
