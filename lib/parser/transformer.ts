import { IToken, TagOpen, TagClose, Text as TokenText, WhiteLine, WhiteSpace } from './tokenizer'

interface Node {
  name: string
  childNodes?: Array<INode>
}
class Document implements Node {
  name = 'root'
  childNodes: Array<INode> = []
}
class Element implements Node {
  name: string
  childNodes: Array<INode> = []
  constructor(name: string) {
    this.name = name
  }
}
class Text implements Node {
  name: string
  constructor(name: string) {
    this.name = name
  }
}
type INode = Document | Element | Text

export class Transformer {

  output: string = ''

  stack: Array<INode> = [new Document]

  getInput(token: IToken) {
    switch (token.constructor) {
      case TagOpen: return this.handleTagOpen(<TagOpen>token)
      case TagClose: return this.handleTagClose(<TagClose>token)
      case WhiteLine: return this.handleWhiteLine()
      case WhiteSpace: return this.handleWhiteSpace()
      case TokenText: return this.hanldeText(<TokenText>token)
      default: console.warn('what a token:', token)
    }
  }

  handleTagOpen(token: TagOpen) {
    let tagName
    if (token.name.startsWith('#')) {
      tagName = `h${token.name.length}`
    } else {
      tagName = token.name
    }
    this.output += `<${tagName}>`


    const ele = new Element(tagName)
    const top = <Document | Element>this.stack[this.stack.length - 1]
    top.childNodes.push(ele)
    this.stack.push(ele)
  }

  handleTagClose(token: TagClose) {
    const top = <TagOpen>this.stack[this.stack.length - 1]
    let tagName
    if (top.name.startsWith('#')) {
      tagName = `h${top.name.length}`
    } else {
      tagName = top.name
    }
    this.output += `</${tagName}>`
    this.stack.pop()
  }

  handleWhiteSpace() {
    const ele = new Text('&nbsp;')
    const top = <Document | Element>this.stack[this.stack.length - 1]
    // 标签的第一个子节点不可以是空格
    if (top.childNodes.length > 0) {
      top.childNodes.push(ele)
      this.output += ' '
    }
  }

  handleWhiteLine() {
    const ele = new Element('br/')
    const top = <Document | Element>this.stack[this.stack.length - 1]
    // 标签的第一个子节点不可以是空行
    if (top.childNodes.length > 0) {
      top.childNodes.push(ele)
      this.output += '<br/>'
    }
  }

  hanldeText(token: TokenText) {
    const ele = new Text(token.value)
    const top = <Document | Element>this.stack[this.stack.length - 1]
    top.childNodes.push(ele)
    this.output += token.value
  }
}