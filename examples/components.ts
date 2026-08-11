import { div, span, img, recommendedBoxRadius, type VNode } from '../src/index.js'
import { ACCENT, TEXT_COLOR, BOX_BG, BOX_BORDER } from './colors.js'
import { boltUrl } from './icon.js'

export function iconBox(boxSize: number, iconSize: number, color = ACCENT, borderColor = BOX_BORDER): VNode {
  return div({
    width:          boxSize,
    height:         boxSize,
    background:     BOX_BG,
    border:         `1.5px solid ${borderColor}`,
    borderRadius:   recommendedBoxRadius(boxSize),
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  }, img(boltUrl(iconSize, color), iconSize))
}

export function brandText(fontSize: number, color = TEXT_COLOR): VNode {
  return span({
    fontFamily: 'Inter', fontWeight: 800, fontSize, color,
    letterSpacing: Math.round(fontSize * -0.02),
  }, 'Acme')
}

export function sloganLine(text: string, fontSize = 64, color = TEXT_COLOR): VNode {
  return span({
    fontFamily:    'Inter',
    fontWeight:    600,
    fontSize,
    color,
    letterSpacing: Math.round(fontSize * -0.02),
    lineHeight:    1,
  }, text)
}
