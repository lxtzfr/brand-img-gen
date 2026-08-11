import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'
import { loadFont } from '../src/index.js'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const FILES = resolve(ROOT, 'node_modules/@fontsource/inter/files')

export const fonts = [
  loadFont(resolve(FILES, 'inter-latin-800-normal.woff'), 'Inter', 800),
  loadFont(resolve(FILES, 'inter-latin-600-normal.woff'), 'Inter', 600),
  loadFont(resolve(FILES, 'inter-latin-400-normal.woff'), 'Inter', 400),
]
