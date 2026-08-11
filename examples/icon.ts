import { ACCENT } from './colors.js'

// Filled bolt icon, 24×24 viewBox — swap for any icon set/SVG you like.
export const BOLT_PATH = `<path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/>`

export function boltSvg(size: number, color: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">${BOLT_PATH}</svg>`
}

export function boltUrl(size: number, color = ACCENT): string {
  return `data:image/svg+xml;base64,${Buffer.from(boltSvg(size, color)).toString('base64')}`
}

export function faviconSvg(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="${ACCENT}">${BOLT_PATH}</svg>`
}
