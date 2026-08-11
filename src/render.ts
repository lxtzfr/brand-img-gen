import satori from 'satori'
import { Resvg } from '@resvg/resvg-js'
import sharp from 'sharp'
import toIco from 'to-ico'
import type { FontConfig } from './fonts.js'
import type { VNode } from './vnode.js'

export interface RgbColor { r: number; g: number; b: number }

/** Render a vnode tree to a PNG buffer via satori + resvg. */
export async function renderVnode(vnode: VNode, w: number, h: number, fonts: FontConfig[]): Promise<Buffer> {
  const svg = await satori(vnode as never, { width: w, height: h, fonts })
  return Buffer.from(new Resvg(svg).render().asPng())
}

/** Composite arbitrary PNG layers over a solid-color background. */
export async function renderComposite(w: number, h: number, background: RgbColor, layers: Buffer[]): Promise<Buffer> {
  const bg = await sharp({ create: { width: w, height: h, channels: 3, background } }).png().toBuffer()
  return sharp(bg)
    .composite(layers.map((input) => ({ input, blend: 'over' as const })))
    .png()
    .toBuffer()
}

/**
 * Composite: solid background + optional pattern layer + content (transparent) → final PNG.
 * `patternSvg`, if given, is rendered and placed under the content layer.
 */
export async function renderBanner(
  w: number, h: number,
  content: VNode,
  fonts: FontConfig[],
  background: RgbColor,
  patternSvg?: string,
): Promise<Buffer> {
  const layers: Buffer[] = []
  if (patternSvg) layers.push(Buffer.from(new Resvg(patternSvg).render().asPng()))
  layers.push(await renderVnode(content, w, h, fonts))
  return renderComposite(w, h, background, layers)
}

/** A stack layer for {@link renderLayers} — a satori vnode, a raw SVG string, or an already-rendered PNG buffer. */
export type Layer =
  | { kind: 'vnode'; node: VNode }
  | { kind: 'svg'; svg: string }
  | { kind: 'png'; data: Buffer }

/**
 * Composite an arbitrary stack of layers, bottom to top — each one a satori
 * vnode (e.g. a `bannerFrame` with a gradient `background`), a raw SVG string
 * (e.g. from {@link diagonalPattern}/`scatterPattern`), or a pre-rendered PNG.
 * More flexible than {@link renderBanner}: the background can itself be a
 * styled vnode (gradient, non-rectangular shape…) instead of a flat
 * `RgbColor`, and the content layer is optional — e.g. a pattern-only banner
 * with no centered mark on top.
 */
export async function renderLayers(
  w: number, h: number,
  layers: Layer[],
  fonts: FontConfig[],
  underColor: RgbColor = { r: 255, g: 255, b: 255 },
): Promise<Buffer> {
  const pngs = await Promise.all(
    layers.map((layer) => {
      if (layer.kind === 'vnode') return renderVnode(layer.node, w, h, fonts)
      if (layer.kind === 'svg') return Promise.resolve(Buffer.from(new Resvg(layer.svg).render().asPng()))
      return Promise.resolve(layer.data)
    }),
  )
  return renderComposite(w, h, underColor, pngs)
}

/** Rasterize an SVG to PNGs at the given sizes and pack them into a multi-resolution .ico. */
export async function buildFavicon(svg: string, sizes: number[] = [16, 32]): Promise<{ ico: Buffer; pngs: Record<number, Buffer> }> {
  const pngs: Record<number, Buffer> = {}
  for (const size of sizes) {
    pngs[size] = Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng())
  }
  // The .ico container's directory entries are 1 byte per dimension (0 means
  // 256), so sizes above that can't be packed into the .ico itself — they're
  // silently left out of the ico while still coming back as standalone PNGs,
  // so callers can request e.g. [16, 32, 192, 512] in one go without the ico
  // packer throwing on the 512.
  const icoSizes = sizes.filter((size) => size <= 256)
  const ico = await toIco(icoSizes.map((size) => pngs[size]))
  return { ico, pngs }
}
