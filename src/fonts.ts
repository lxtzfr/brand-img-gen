import { readFileSync } from 'fs'

export type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900

export interface FontConfig {
  name:   string
  data:   Buffer
  weight: FontWeight
  style:  'normal' | 'italic'
}

/** Load a font file (woff/woff2/ttf/otf) from disk for use with satori. */
export function loadFont(path: string, name: string, weight: FontWeight, style: 'normal' | 'italic' = 'normal'): FontConfig {
  return { name, data: readFileSync(path), weight, style }
}
