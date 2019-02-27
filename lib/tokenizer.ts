
import {
  isLineBreak,
  isWhiteSpace,
  isPlainChar
} from './utils'

interface Token {}

function error(char: string, tokens: Array<IToken>) {
  console.error(`unexcepted char: ${char}`, tokens)
  throw Error(`unexcepted char: ${char}`)
  // TODO: 可以忽略错误继续解析 抛弃当前的token
}

// # ## ...
class HeadTag implements Token {
  
  level: number = 1

  up() {
    this.level += 1
  }
}

class HeadContent implements Token {

  value: string

  constructor(c: string) {
    this.value = c
  }

  add(c: string) {
    this.value += c
  }
}

class Text implements Token {

  value: string

  constructor(c: string) {
    this.value = c
  }
}

class LineBreak implements Token {}

class WhiteSpace implements Token {}


// 所有token的联合类型
type IToken = HeadTag
  | HeadContent
  | Text
  | LineBreak

class Tokenizer {

  onEmit: Function = null
  state: Function = null
  tokens: Array<IToken> = []
  token: IToken

  constructor(onEmit?: Function) {
    if (onEmit) {
      this.onEmit = onEmit
    }
    // 将当前状态设为初始状态
    this.state = this.data
  }

  // 收集token
  emitToken() {
    if (this.token === null) return
    this.tokens.push(this.token)
    if (this.onEmit !== null) {
      this.onEmit.call(null, this.token)
    }
    this.token = null
  }

  // 接受输入字符
  getInput(c: String) {
    if (!this.state) return
    this.state = this.state(c)
  }

  // 初始状态 处理所有字符
  data(c: string): Function {
    if (c === '#') {
      this.token = new HeadTag
      return this.isHeadTag
    } else if (isLineBreak(c)) {
      this.token = new LineBreak
      return this.data
    }
    return this.data
  }

  // 遇到`#`
  isHeadTag(c: string): Function {
    if (c === '#') {
      (<HeadTag>this.token).up()
      return this.isHeadTag
    } else if (isWhiteSpace(c)) {
      // 遇到空格 表示head tag已经完整 接下来应该是head content
      this.emitToken()
      return this.beforeHeadContent
    }
    error(c, this.tokens)
  }

  // 
  beforeHeadContent(c: string): Function {
    if (isWhiteSpace(c)) {
      // 忽略# 之后的空格
      return this.beforeHeadContent
    } else if (isPlainChar(c)) {
      // 遇到文本
      this.token = new Text(c)
      this.emitToken()
      return this.inContent
    }
    error(c, this.tokens)
  }

  inContent(c: string): Function {
    if (isLineBreak(c)) {
      // 换行 表示head content完成
      this.emitToken()
      return this.data
    }
    // 任意字符都记作Text
    this.token = new Text(c)
    this.emitToken()
    return this.inContent
  }

}

export {
  Tokenizer
}