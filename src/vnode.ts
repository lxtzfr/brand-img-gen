export type Style = Record<string, string | number>
export type VNode = { type: string; key: null; props: Record<string, unknown> }

export const el = (type: string, props: Record<string, unknown>): VNode => ({ type, key: null, props })

export const div = (style: Style, ...children: (VNode | string)[]): VNode =>
  el('div', { style, children: children.length === 1 ? children[0] : children })

export const span = (style: Style, text: string): VNode =>
  el('span', { style, children: text })

export const img = (src: string, w: number, h: number = w): VNode =>
  el('img', { src, width: w, height: h, style: {} })
