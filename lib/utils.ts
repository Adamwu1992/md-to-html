// 空格或者tab
export function isWhiteSpace(c: string): boolean {
  return c === ' ' || c === '\t'
}
// 回车或者换行
export function isLineBreak(c: string): boolean {
  return c === '\r' || c === '\n'
}

export function isPlainChar(c: string): boolean {
  return !isWhiteSpace(c) && !isLineBreak(c)
}