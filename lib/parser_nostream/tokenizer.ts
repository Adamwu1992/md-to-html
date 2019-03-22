import { isTag, isWhiteSpace, isLineBreak, isText, EOF } from './share'

export class Tag {
  name: string
  constructor(name: string) {
    this.name = name
  }
  // 判断字符是否属于同一个标签
  belongs(c: string): Boolean {
    return this.name.length && this.name[0] === c
  }
}

export class Content {
  value: string
  constructor(value: string) {
    this.value = value
  }
}

export class WhiteSpace {}

export class LineBreak {}

export type IToken = Tag | Content | WhiteSpace | LineBreak

export interface TokenState {
  (c: string): TokenState
}

/**
 * 将输入的字符串转化为tokens
 * token的类型分为：
 * - 标签（tag）
 * - 文本（text）
 * - 空格（whitespace）
 * 
 * Tokenizer忠实的转化获得的字符，不作其他处理
 */
export class Tokenizer {
  output: Array<IToken>
  private token: IToken

  private collectToken(token = this.token) {
    if (!this.output) {
      this.output = []
    }
    if (!token) return
    this.output.push(token)
  }

  getInput(c: string) {
    this.state = this.state(c)
  }

  private state(c: string): TokenState {
    if (c === EOF) {
      if (this.token) {
        this.collectToken()
      }
      return
    }
    if (isTag(c)) {
      // 遇到标签，记录标签，进入atTagBeginning状态
      this.token = new Tag(c)
      return this.atTagBeginning
    } else if (isText(c)) {
      // 遇到文本，收集文本，进入beforeContent状态
      this.collectToken(new Content(c))
      return this.beforeContent
    }
    // 忽略空格和换行
    return this.state
  }

  // 当前token是一个标签
  private atTagBeginning(c: string): TokenState {
    if (c === EOF) {
      if (this.token) {
        this.collectToken()
      }
      return
    }
    if (isTag(c)) {
      // 如果遇到标签字符，且属于当前标签，添加进当前token
      if((<Tag>this.token).belongs(c)) {
        (<Tag>this.token).name += c
      } else {
        // 否则，收集当前token，并且创建一个新的标签token
        this.collectToken()
        this.token = new Tag(c)
      }
      return this.atTagBeginning
    } else if (isWhiteSpace(c)) {
      // 如果遇到空格，表示当前的标签结束
      this.collectToken()
      this.collectToken(new WhiteSpace)
      return this.beforeContent
    } else if (isLineBreak(c)) {
      // 如果遇到换行，表示标签结束
      this.collectToken()
      this.collectToken(new LineBreak)
      return this.beforeContent
    } else {
      // 如果遇到文本，表示标签结束
      this.collectToken()
      this.collectToken(new Content(c))
      return this.beforeContent
    }
  }

  // 标签结束 接下来是标签的文本
  private beforeContent(c: string): TokenState {
    if (c === EOF) {
      if (this.token) {
        this.collectToken()
      }
      return
    }
    if (isTag(c)) {
      // 如果遇到标签，表示处于atTagBeginning状态
      this.token = new Tag(c)
      return this.atTagBeginning
    } else if (isWhiteSpace(c) || isText(c)) {
      // 如果遇到文本或者空格，表示是标签的文本
      if (isWhiteSpace(c)) {
        this.collectToken(new WhiteSpace)
      } else {
        this.collectToken(new Content(c))
      }
      return this.beforeContent
    } else {
      // 如果遇到换行 表示标签文本结束
      this.collectToken(new LineBreak)
      return this.afterContent
    }
  }

  private afterContent(c: string): TokenState {
    if (c === EOF) {
      if (this.token) {
        this.collectToken()
      }
      return
    }
    if (isTag(c)) {
      // 如果遇到标签，表示处于atTagBeginning状态
      this.token = new Tag(c)
      return this.atTagBeginning
    } else if (isText(c)) {
      // 如果遇到文本，记录文本，进入beforeContent状态
      this.collectToken(new Content(c))
      return this.beforeContent
    } else {
      // 遇到空格和换行，记录
      if (isWhiteSpace(c)) {
        this.collectToken(new WhiteSpace)
      } else {
        this.collectToken(new LineBreak)
      }
      return this.afterContent
    }
  }

}