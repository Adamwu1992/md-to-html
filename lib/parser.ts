import { Stack } from './stack'
import {
  IToken,
  HeadTag as THeadTag,
  HeadTagEnd as THeadTagEnd,
  Text as TText,
  WhiteSpace as TWhiteSpace,
  LineBreak as TLineBreak,
  BlankLine as TBlankLine
} from './tokenizer'

interface Node {
  name: string
}

export class Element implements Node {
  name: string
  childNodes: Array<INode>

  constructor(name?: string) {
    this.name = name
    this.childNodes = []
  }
}

export class Text implements Node {
  name: string

  constructor(c: TText) {
    this.name = c.value
  }

  append(c: TText) {
    this.name += c.value
  }

  appendWhiteSpace() {
    this.name += '&nbsp;'
  }
}

export class Root implements Node {
  name: 'root'
  childNodes: Array<INode> = []
}

export type INode = Element | Text | Root

export class Parser {

  stack: Stack<INode>

  constructor() {
    this.stack = new Stack<INode>()
    this.stack.push(new Root)
  }

  // 获取构建的AST 即栈底根节点
  getOutput(): INode {
    return this.stack.bottom()
  }

  getInput(token: IToken) {
    if (token instanceof THeadTag) {
      const ele = new Element(`h${token.level}`)
      this.appendChild(ele)
      this.stack.push(ele)
    } else if (token instanceof TText) {
      // 判断栈顶节点
      // 如果是文本 追加
      // 否则创建一个文本节点 并添加到栈顶节点的子节点
      const currentNode = this.stack.top()
      if (currentNode instanceof Text) {
        currentNode.append(token)
      } else {
        const ele = new Text(token)
        this.appendChild(ele)
        // this.stack.push(ele)
      }
    } else if (token instanceof TWhiteSpace) {
      const currentNode = this.stack.top()
      if (currentNode instanceof Text) {
        currentNode.appendWhiteSpace()
      }
    } else if (token instanceof THeadTagEnd) {
      this.stack.pop()
    }
  }

  // 想当前栈顶节点添加子节点
  appendChild(ele: INode) {
    const parent = <Element | Root>(this.stack.top())
    try {
      parent.childNodes.push(ele)
    } catch (e) {
      console.log(this.stack)
      console.log(parent)
      throw e
    }
  }

  handleHead(token: IToken) {}
}