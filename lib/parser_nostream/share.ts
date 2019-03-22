export const EOF: undefined = void 0

export function isTag(c: string): boolean {
  return c === '#' ||
    c === '*' ||
    c === '_' ||
    c === '>' ||
    c === '-' ||
    c === '=' ||
    c === '`'
}

// 回车或者换行
export function isLineBreak(c: string): boolean {
  return c === '\r' || c === '\n'
}

// 空格或者tab
export function isWhiteSpace(c: string): boolean {
  return c === ' ' || c === '\t'
}

// 文本
export function isText(c: string): boolean {
  return !isTag(c) && !isWhiteSpace(c) && !isLineBreak(c)
}