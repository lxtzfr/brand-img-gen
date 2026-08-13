import { div, type VNode, type Style } from './vnode.js'
import type { AssetSpec } from './specs.js'

/** Gap between stacked elements, scaled to the frame's shorter side. Override when a template needs a different rhythm. */
export function recommendedGap(spec: AssetSpec): number {
  return Math.round(Math.min(spec.width, spec.height) * 0.065)
}

/** Outer safety margin so content never touches the edges, scaled to the frame's shorter side. */
export function recommendedPadding(spec: AssetSpec): number {
  return Math.round(Math.min(spec.width, spec.height) * 0.1)
}

/** Icon fill ratio for a square logo frame — the icon occupies this fraction of the frame. */
export const RECOMMENDED_LOGO_ICON_RATIO = 0.78

/** Corner radius for a rounded icon box, scaled to the box size. */
export function recommendedBoxRadius(boxSize: number): number {
  return Math.round(boxSize * 0.22)
}

export interface FrameOptions {
  background?: string
  direction?:  'row' | 'column'
  gap?:        number
  padding?:    number
  style?:      Style
}

/**
 * A centered flex frame at a fixed size, with a recommended gap/padding baked in
 * (both derived from `spec` and overridable). This is the standard outer container
 * for banners, OG images, profile cards, etc. — pass your header row / slogan / etc as children.
 */
export function bannerFrame(spec: AssetSpec, options: FrameOptions = {}, ...children: (VNode | string)[]): VNode {
  const {
    background,
    direction = 'column',
    gap       = recommendedGap(spec),
    padding   = recommendedPadding(spec),
    style     = {},
  } = options

  return div({
    width:  spec.width,
    height: spec.height,
    ...(background ? { background } : {}),
    display:        'flex',
    flexDirection:  direction,
    alignItems:     'center',
    justifyContent: 'center',
    gap,
    padding,
    ...style,
  }, ...children)
}

export interface LogoFrameOptions {
  background: string
  iconRatio?: number
  style?:     Style
}

/** A square icon-on-solid-background frame (app icon / square logo), icon centered at a recommended fill ratio. */
export function logoFrame(size: number, icon: VNode, options: LogoFrameOptions): VNode {
  const { background, iconRatio = RECOMMENDED_LOGO_ICON_RATIO, style = {} } = options
  const iconBoxSize = Math.round(size * iconRatio)
  return div({
    width:          size,
    height:         size,
    background,
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    ...style,
  }, div({ width: iconBoxSize, height: iconBoxSize, display: 'flex', alignItems: 'center', justifyContent: 'center' }, icon))
}

/** A horizontal row (e.g. icon box + brand text), gap defaults to a fraction of the row's own children scale — pass explicitly for fine control. */
export function headerRow(gap: number, ...children: (VNode | string)[]): VNode {
  return div({ display: 'flex', alignItems: 'center', gap }, ...children)
}
