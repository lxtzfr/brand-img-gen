import { scatterPattern } from '../src/index.js'
import { BOLT_PATH } from './icon.js'

/** The example's scattered-icon banner background, built on top of the generic pattern engine. */
export function boltPattern(w: number, h: number, count: number, size = 26): string {
  return scatterPattern(w, h, count, size, BOLT_PATH)
}
