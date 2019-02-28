
import {
  isLineBreak,
  isWhiteSpace,
  isPlainChar
} from './utils'

function error(char: string, tokens: Array<IToken>) {
  console.error(`unexcepted char: ${char}`, tokens)
  throw Error(`unexcepted char: ${char}`)
  // TODO: 可以忽略错误继续解析 抛弃当前的token
}

interface Token {}

export class TagOpen implements Token {
  name: string

  constructor(c: string) {
    this.name = c
  }
}

export class TagClose implements Token {
  name?: string
}

// # ## ...
export class HeadTag implements Token {
  
  level: number = 1

  up() {
    this.level += 1
  }
}
export class HeadTagEnd implements Token {}

export class ParagraphTag implements Token {}

export class ParagtaphTagEnd implements Token {}

export class Text implements Token {

  value: string

  constructor(c: string) {
    this.value = c
  }
}

export class LineBreak implements Token {}

export class WhiteSpace implements Token {
  // 连续空格的数量
  num: number = 1

  add() {
    this.num += 1
  }
}

export class BlankLine implements Token {}


// 所有token的联合类型
export type IToken = HeadTag
  | Text
  | LineBreak

export class Tokenizer {

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
      // 换行符忽略不计
      // this.token = new LineBreak
      return this.data
    } else if (isPlainChar(c)) {
      this.token = new Text(c)
      this.emitToken()
      return this.isParagraph
    }
    return this.data
  }

  _state(c: string): Function {
    if (c === '#') {
      this.token = new TagOpen(c)
      return this.beginTagOpen
    } else if (isPlainChar(c)) {
      // 如果遇到文本字符 表示这是一个段落
      this.token = new TagOpen('p')
      this.emitToken()
      this.token = new Text(c)
      this.emitToken()
      return this.beginTagContent
    }
  }

  beginTagOpen(c: string): Function {
    if (isWhiteSpace(c)) {
      return this.beginTagContent
    } else if (c === '#') {
      (<TagOpen>this.token).name += c
      return this.beginTagOpen
    }
  }

  beginTagContent(c: string): Function {
    if (isLineBreak(c)) {
      this.token = new TagClose
      this.emitToken()
      return this._state
    } else {
      this.token = new Text(c)
      this.emitToken
    }
  }



  /* ============ old ============== */
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

  // 即将处理标题内容
  beforeHeadContent(c: string): Function {
    if (isWhiteSpace(c)) {
      // 忽略# 之后的空格
      return this.beforeHeadContent
    } else if (isPlainChar(c)) {
      // 遇到文本
      this.token = new Text(c)
      this.emitToken()
      return this.inHeadContent
    }
    error(c, this.tokens)
  }

  // 处理标题内容
  inHeadContent(c: string): Function {
    if (isLineBreak(c)) {
      // 换行 表示head content完成
      // 如果换行前的token是空格 
      // TODO: 是否需要记录标签关闭？？
      this.token = new HeadTagEnd
      this.emitToken()
      return this.data
    } else if (isWhiteSpace(c)) {
      // Head Content 中的连续多个空格只记为一个
      if (!(this.token instanceof WhiteSpace)) {
        this.token = new WhiteSpace
      } else {
        (<WhiteSpace>this.token).add()
      }
      return this.inHeadContent
    } else if (isPlainChar(c)) {
      if (this.token instanceof WhiteSpace) {
        // 如果遇到字符 且前一个token是空格 记录空格token
        this.emitToken()
      }
      this.token = new Text(c)
      this.emitToken()
      return this.inHeadContent
    }
    error(c, this.tokens)
  }

  // TODO: 废弃
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

  // 处理段落
  isParagraph(c: string): Function {
    if (isPlainChar(c)) {
      if (this.token instanceof WhiteSpace) {
        // 如果前一个文本是空格 记录
        this.emitToken()
      }
      // 遇到文本 记录为Text token
      this.token = new Text(c)
      this.emitToken()
      return this.isParagraph
    } else if (isWhiteSpace(c)) {
      if (!(this.token instanceof WhiteSpace)) {
        this.token = new WhiteSpace
      } else {
        (<WhiteSpace>this.token).add()
      }
      return this.isParagraph
    } else if (isLineBreak(c)) {
      if (this.token instanceof WhiteSpace) {
        const token = <WhiteSpace>this.token
        if (token.num > 1) {
          // 段落中连续两个以上空格+换行 记录为一个空行
          this.token = new BlankLine
          this.emitToken()
        }
      } else {
        this.token = new LineBreak
        this.emitToken()
      }
      return this.data
    }
    error(c, this.tokens)
  }

}
