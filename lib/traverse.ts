
import { Text } from './parser'

function isObject(x: any): boolean {
  return x !== null && typeof x === 'object'
}
function isArray(x: any): boolean {
  return Array.isArray(x)
}

let level = 0
export function traverse(val: any, onMet: Function) {
  onMet.call(null, val)
  if ((!isArray(val) && !isObject(val)) || Object.isFrozen(val) || val instanceof Text) {
    return
  }
  let i
  if (isArray(val)) {
    i = val.length
    while(i--) {
      traverse(val[i], onMet)
    }
  } else {
    const keys = Object.keys(val)
    i = keys.length
    while(i--) {
      traverse(val[keys[i]], onMet)
    }
  }
}
