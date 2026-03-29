declare module 'leaflet.heat' {
  import * as L from 'leaflet'

  interface HeatMapOptions {
    minOpacity?: number
    maxZoom?: number
    max?: number
    radius?: number
    blur?: number
    gradient?: Record<number, string>
  }

  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: HeatMapOptions
  ): L.Layer

  export { heatLayer }
}

declare module 'leaflet' {
  function heatLayer(
    latlngs: Array<[number, number, number?]>,
    options?: {
      minOpacity?: number
      maxZoom?: number
      max?: number
      radius?: number
      blur?: number
      gradient?: Record<number, string>
    }
  ): Layer
}
