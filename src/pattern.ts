function seededRand(seed: number) {
  let s = seed
  return () => {
    s = Math.imul(s, 1664525) + 1013904223 | 0
    return (s >>> 0) / 4294967296
  }
}

/**
 * Scattered-icon pattern SVG — transparent background, meant to be composited
 * over a solid-color banner. `iconPaths` is the inner markup of a 24×24 viewBox
 * icon (e.g. lucide-style `<path>`/`<rect>` elements), supplied by the consumer.
 */
export function scatterPattern(w: number, h: number, count: number, size: number, iconPaths: string, seed = 1337): string {
  const rand  = seededRand(seed)
  const icons: string[] = []

  for (let i = 0; i < count; i++) {
    const x       = rand() * w
    const y       = rand() * h
    const s       = size * (0.65 + rand() * 0.7)
    const rot     = (rand() - 0.5) * 50
    const opacity = (0.07 + rand() * 0.11).toFixed(3)
    const sw      = (2.2 * 24 / s).toFixed(2)
    const cx      = (s / 2).toFixed(1)

    icons.push(
      `<g transform="translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${rot.toFixed(1)},${cx},${cx})" opacity="${opacity}">` +
      `<svg width="${s.toFixed(1)}" height="${s.toFixed(1)}" viewBox="0 0 24 24" fill="none"` +
      ` stroke="white" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">` +
      iconPaths +
      `</svg></g>`,
    )
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${icons.join('')}</svg>`
}

export interface DiagonalPatternOptions {
  /** Height of each tile in px — width is derived from `viewBoxW`/`viewBoxH`. Defaults to 22% of the canvas's shorter side. */
  tileSize?: number
  /** Spacing between tile centers, along both axes. Defaults to 40% of the canvas's shorter side. */
  gap?: number
  opacity?: number
  rotation?: number
}

/**
 * A staggered, evenly-spaced repeat of one mark/icon across the whole
 * canvas — the "Fall Guys background" look: same tile, same size, same
 * rotation, alternating rows offset by half a gap, transparent background.
 * Unlike `scatterPattern` (randomly placed/sized/rotated stroke icons),
 * this is for a single already-colored, filled tile repeated on a
 * deterministic grid — pass any SVG markup (e.g. `<polygon>`/`<path
 * fill="...">`) already at its own intrinsic viewBox size.
 */
export function diagonalPattern(
  w: number, h: number,
  tileMarkup: string, viewBoxW: number, viewBoxH: number,
  options: DiagonalPatternOptions = {},
): string {
  const minDim = Math.min(w, h)
  const {
    tileSize = minDim * 0.22,
    gap      = minDim * 0.4,
    opacity  = 0.14,
    rotation = -18,
  } = options
  const scale = tileSize / viewBoxH

  // Overscan on every side so staggered/rotated tiles still cover the corners.
  const pad = gap * 1.5
  const tiles: string[] = []
  let row = 0
  for (let y = -pad; y < h + pad; y += gap) {
    const xOffset = row % 2 === 0 ? 0 : gap / 2
    for (let x = -pad; x < w + pad; x += gap) {
      const transform =
        `translate(${(x + xOffset).toFixed(1)},${y.toFixed(1)}) ` +
        `rotate(${rotation}) scale(${scale.toFixed(4)}) ` +
        `translate(${-viewBoxW / 2},${-viewBoxH / 2})`
      tiles.push(`<g transform="${transform}" opacity="${opacity}">${tileMarkup}</g>`)
    }
    row++
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${tiles.join('')}</svg>`
}
