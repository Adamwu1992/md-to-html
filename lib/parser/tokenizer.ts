
import {
  isLineBreak,
  isWhiteSpace,
  isPlainChar,
  isTagBeginning,
  EOF
} from '../utils'

function error(char: string, tokens: Array<IToken>) {
  console.error(`unexcepted char: ${char}`, tokens)
  throw Error(`unexcepted char: ${char}`)
  // TODO: 可以忽略错误继续解析 抛弃当前的token
}

interface Token {}

// 开始标签
export class TagOpen implements Token {
  name: string

  constructor(c: string) {
    this.name = c
  }
}
// 关闭标签
export class TagClose implements Token {
  name?: string
}
// 文本
export class Text implements Token {

  value: string

  constructor(c: string) {
    this.value = c
  }
}
// 空格
export class WhiteSpace implements Token {
  // 连续空格的数量
  num: number = 1

  add() {
    this.num += 1
  }
}
// 空行
export class WhiteLine implements Token {}

// 所有token的联合类型
export type IToken = TagOpen
  | TagClose
  | Text
  | WhiteSpace
  | WhiteLine

export class Tokenizer {

  // 收集token时触发
  onEmit: Function = null
  // 当前状态
  state: Function = null
  // 已收集的token集合
  tokens: Array<IToken> = []
  // 当前正在处理的token
  token: IToken
  // 文本中的连续空格数
  successiveWhiteSpace: number = 0

  constructor(onEmit?: Function) {
    if (onEmit) {
      this.onEmit = onEmit
    }
    // 将当前状态设为初始状态
    // this.state = this.data
    this.state = this._state
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
  _state(c: string): Function {

    // 终止符
    if (c === EOF) { return }

    if (isTagBeginning(c)) {
      if (this.token instanceof WhiteLine) {
        this.emitToken()
      }
      this.token = new TagOpen(c)
      return this.beginTagOpen
    } else if (isPlainChar(c)) {
      if (this.token instanceof WhiteLine) {
        this.emitToken()
      }
      // 如果遇到文本字符 表示这是一个段落
      this.token = new TagOpen('p')
      this.emitToken()
      this.token = new Text(c)
      this.emitToken()
      return this.beginTagContent
    } else if (isLineBreak(c)) {
      // 如果遇到换行符 暂存一个空行token 以便合并连续多个空行
      this.token = new WhiteLine
    }
    return this._state
  }

  // 处理标签
  beginTagOpen(c: string): Function {
    if (isTagBeginning(c)) {
      // 遇到标签字符 判断和已有标签是否相同
      const currentTagOpen = <TagOpen>this.token
      if (currentTagOpen.name === c) {
        // 如果相同 表示是同一个标签
        currentTagOpen.name += c
      } else {
        // 否则 记录当前标签 并创建一个新的标签
        this.emitToken()
        this.token = new TagOpen(c)
      }
      return this.beginTagOpen
    }
    // 遇到非标签字符串 表示标签结束
    if (isWhiteSpace(c)) {
      this.emitToken()
    } else {
      this.emitToken()
      this.token = new Text(c)
      this.emitToken()
    }
    return this.beginTagContent
    
  }

  // 处理文本
  beginTagContent(c: string): Function {
    // 处理终止符 记录一个结束标签
    if (c === EOF) {
      this.token = new TagClose
      this.emitToken()
      return
    }
    
    if (isLineBreak(c)) {
      this.token = new TagClose
      this.emitToken()
      // 遇到换行 检查换行前的空格数 连续2个或以上 则暂存一个空行
      if (this.successiveWhiteSpace > 1) {
        this.token = new WhiteLine
      }
      this.successiveWhiteSpace = 0
      return this._state
    } else if(isWhiteSpace(c)) {
      // 遇到空格 记录空格数
      this.successiveWhiteSpace += 1
      // 暂存token但不记录 以便合并多个连续的空格
      this.token = new WhiteSpace
      return this.beginTagContent
    } else {
      // 如果字符前是空格 记录token
      if (this.token instanceof WhiteSpace) {
        this.emitToken()
      }
      // 遇到文本字符 记录token
      this.token = new Text(c)
      this.emitToken()
      this.successiveWhiteSpace = 0
      return this.beginTagContent
    }
  }

}
