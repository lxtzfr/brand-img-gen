export interface AssetSpec {
  name:   string
  width:  number
  height: number
}

/** Standard dimensions for common web/social assets. Consumers pick which ones they need. */
export const SPECS = {
  OG:               { name: 'og',               width: 1200, height: 630 },
  TWITTER_BANNER:   { name: 'twitter-banner',   width: 1500, height: 500 },
  LINKEDIN_BANNER:  { name: 'linkedin-banner',  width: 720,  height: 121 },
  DISCORD_BANNER:   { name: 'discord-banner',   width: 680,  height: 240 },
  REDDIT_BANNER:    { name: 'reddit-banner',    width: 1920, height: 384 },
  FAVICON_16:       { name: 'favicon-16',       width: 16,   height: 16  },
  FAVICON_32:       { name: 'favicon-32',       width: 32,   height: 32  },
  APPLE_TOUCH_ICON: { name: 'apple-touch-icon', width: 180,  height: 180 },
  LOGO_SQUARE:      { name: 'logo',             width: 512,  height: 512 },
} as const satisfies Record<string, AssetSpec>
