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

/** Rasterize an SVG to PNGs at the given sizes and pack them into a multi-resolution .ico. */
export async function buildFavicon(svg: string, sizes: number[] = [16, 32]): Promise<{ ico: Buffer; pngs: Record<number, Buffer> }> {
  const pngs: Record<number, Buffer> = {}
  for (const size of sizes) {
    pngs[size] = Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng())
  }
  const ico = await toIco(sizes.map((size) => pngs[size]))
  return { ico, pngs }
}
