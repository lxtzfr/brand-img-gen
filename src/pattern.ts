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
