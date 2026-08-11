import { div, span, bannerFrame, logoFrame, headerRow, img, SPECS, type VNode } from '../src/index.js'
import { ACCENT, TEXT_COLOR, BOX_BG } from './colors.js'
import { boltUrl } from './icon.js'
import { iconBox, brandText, sloganLine } from './components.js'

const SLOGAN = ['Your tagline', 'goes here.'] as const

function sloganBlock(fontSize = 64): VNode {
  return div({ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 },
    sloganLine(SLOGAN[0], fontSize),
    sloganLine(SLOGAN[1], fontSize),
  )
}

/** Square logo (1:1) — icon on solid bg, no box */
export function tplLogo(size = SPECS.LOGO_SQUARE.width, color = ACCENT): VNode {
  const iconSize = Math.round(size * 0.6)
  return logoFrame(size, img(boltUrl(iconSize, color), iconSize), { background: BOX_BG })
}

/** OG image */
export function tplOG(): VNode {
  return bannerFrame(SPECS.OG, { gap: 36, padding: 0 },
    headerRow(24, iconBox(96, 56), brandText(72)),
    sloganBlock(64),
  )
}

/** Twitter/X profile banner */
export function tplTwitterBanner(): VNode {
  return bannerFrame(SPECS.TWITTER_BANNER, { gap: 28, padding: 0 },
    headerRow(20, iconBox(80, 46, ACCENT), brandText(60)),
    sloganBlock(64),
  )
}

/** LinkedIn banner — short and wide, so the tagline stays on one line */
export function tplLinkedIn(): VNode {
  return bannerFrame(SPECS.LINKEDIN_BANNER, { gap: 10, padding: 0 },
    headerRow(12, iconBox(48, 30), brandText(32)),
    span({
      fontFamily: 'Inter', fontWeight: 600, fontSize: 22,
      color: TEXT_COLOR, letterSpacing: -1, lineHeight: 1,
    }, SLOGAN.join(' ')),
  )
}

/** Discord server banner */
export function tplDiscord(): VNode {
  return bannerFrame(SPECS.DISCORD_BANNER, { gap: 18, padding: 0 },
    headerRow(16, iconBox(58, 36), brandText(46)),
    sloganBlock(42),
  )
}

/** Reddit community banner */
export function tplReddit(): VNode {
  return bannerFrame(SPECS.REDDIT_BANNER, { gap: 24, padding: 0 },
    headerRow(22, iconBox(80, 50), brandText(62)),
    sloganBlock(56),
  )
}
