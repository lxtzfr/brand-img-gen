import sharp from 'sharp'
import { mkdirSync, writeFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import { renderVnode, renderBanner, buildFavicon, SPECS } from '../src/index.js'
import { faviconSvg } from './icon.js'
import { BG_RGB } from './colors.js'
import { fonts } from './fonts.js'
import { boltPattern } from './pattern.js'
import { tplLogo, tplOG, tplTwitterBanner, tplLinkedIn, tplDiscord, tplReddit } from './templates.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = resolve(__dirname, '../docs/showcase')

mkdirSync(OUT, { recursive: true })

function save(name: string, data: Buffer | string): Buffer {
  const buf = typeof data === 'string' ? Buffer.from(data) : data
  writeFileSync(resolve(OUT, name), buf)
  console.log(`  generated  docs/showcase/${name}`)
  return buf
}

async function banner(name: string, spec: { width: number; height: number }, content: Parameters<typeof renderBanner>[2], count: number, patternSize: number) {
  save(name, await renderBanner(spec.width, spec.height, content, fonts, BG_RGB, boltPattern(spec.width, spec.height, count, patternSize)))
}

async function main() {
  console.log('Generating showcase assets…\n')

  const favSvg = faviconSvg()
  save('favicon.svg', favSvg)
  const { ico, pngs } = await buildFavicon(favSvg, [16, 32])
  save('favicon-16.png', pngs[16])
  save('favicon-32.png', pngs[32])
  save('favicon.ico', ico)

  const { width: logoSize } = SPECS.LOGO_SQUARE
  const logo = save('logo.png', await renderVnode(tplLogo(logoSize), logoSize, logoSize, fonts))
  save('apple-touch-icon.png', await sharp(logo).resize(SPECS.APPLE_TOUCH_ICON.width, SPECS.APPLE_TOUCH_ICON.height).toBuffer())

  await banner('og.png',              SPECS.OG,              tplOG(),            50, 44)
  await banner('twitter-banner.png',  SPECS.TWITTER_BANNER,  tplTwitterBanner(), 50, 44)
  await banner('linkedin-banner.png', SPECS.LINKEDIN_BANNER, tplLinkedIn(),      28, 44)
  await banner('discord-banner.png',  SPECS.DISCORD_BANNER,  tplDiscord(),       28, 44)
  await banner('reddit-banner.png',   SPECS.REDDIT_BANNER,   tplReddit(),        70, 44)

  console.log('\nDone.')
}

main().catch((err) => { console.error(err); process.exit(1) })
