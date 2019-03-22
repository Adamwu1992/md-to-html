import { IToken, Tag, Content, WhiteSpace, LineBreak } from './tokenizer'

export class Node {}
export class Document extends Node {
  childNodes: Array<Element | Text> = []
}
export class Element extends Node {
  name: string
  childNodes: Array<Element | Text>
  constructor(tag: string | Tag) {
    super()
    if (typeof tag === 'string') {
      this.name = tag
    } else {
      this.name = this.tagName(tag)
    }
    this.childNodes = []
  }

  private tagName(tag: Tag): string {
    switch (tag.name) {
      case '#': return 'h1'
      case '##': return 'h2'
      case '###': return 'h3'
      case '####': return 'h4'
      case '#####': return 'h5'
      case '######': return 'h6'
      case '_':
      case '*': return 'italic'
      case '__':
      case '**': return 'strong'
      // TODO
    }
  }

  static H1_Elment = 1
}
export class Text extends Node {
  value: string
  constructor(value: string) {
    super()
    this.value = value
  }
}

export type INode = Document | Element | Text

/**
 * Parser: 将tokens转化为AST
 */
export class Parser {

  private nodeStack: Array<Document | Element>

  get output(): Document | Element {
    return this.nodeStack[0]
  }

  /**
   * tempNode: 暂存节点
   * 当处理连续的换行或者连续的空格时，如果需要作合并，需要在遇到
   * 上述token（WhiteSpace或LineBreak）时先暂存，而不是直接添加进栈顶节点的childNodes中，
   * 当连续token结束时（遇到其他类型的token），再将token添加到childNodes
   * 
   * 目前：只有WhiteSpace和LineBreak会被暂存
   */
  private tempNode: Element | Text

  constructor() {
    const root = new Document
    this.nodeStack = [root]
  }

  // 栈顶节点
  private get currentNode(): INode {
    const l = this.nodeStack.length
    return this.nodeStack[l - 1]
  }

  // 向栈顶节点添加子节点
  private appendChild(node: Element | Text) {
    if (!node) return
    (<Document | Element>this.currentNode).childNodes.push(node)
  }

  getInput(token: IToken) {
    if (token instanceof Tag) {
      // 遇到标签token
      // TODO: 判断是自闭标签token（#）还是成对标签token（**）
      // 如果有暂存节点，添加到栈顶节点的子节点
      if (this.tempNode) {
        this.appendChild(this.tempNode)
        this.tempNode = null
      }
      const ele = new Element(token);
      this.appendChild(ele)
      this.nodeStack.push(ele)
    } else if (token instanceof LineBreak) {
      // 如果遇到换行token
      // @config 忽略连续的换行
      // 判断暂存节点类型：如果有节点暂存，且不是换行节点，将节点添加到栈顶节点子节点
      if (this.tempNode !== null && this.tempNode instanceof Element && this.tempNode.name !== 'br') {
        this.appendChild(this.tempNode)
        this.tempNode = null
      }

      // 判断栈顶节点
      if (this.currentNode instanceof Element) {
        // 如果栈顶节点是Element 表示该节点已经完整 出栈
        // TODO: 判断是自闭标签token（#）还是成对标签token（**）
        this.nodeStack.pop()
      } else {
        // 如果栈顶节点是根节点
        // 判断前一个节点是不是<br>
        if (this.tempNode instanceof Element && this.tempNode.name === 'br') {
          // 如果前一个节点是<br>，忽略该token
        } else {
          // 暂存<br>
          this.tempNode = new Element('br')
        }
      }
    } else if (token instanceof Content) {
      // 遇到文本token
      // 如果有暂存节点，添加到栈顶节点的子节点
      if (this.tempNode) {
        this.appendChild(this.tempNode)
        this.tempNode = null
      }
      const text = new Text(token.value);
      this.appendChild(text)
    } else if (token instanceof WhiteSpace) {
      // 遇到空格token
      // @config 合并连续的空格

      // 判断暂存节点
      if (this.tempNode === null) {
        // 如果没有暂存节点，暂存该空格节点
        this.tempNode = new Text(' ')
      } else {
        // 如果有暂存节点，判断类型
        if (this.tempNode instanceof Text && this.tempNode.value === ' ') {
          // 如果暂存节点是空格节点，忽略该空格token
        } else {
          // 如果是其他暂存节点，添加进栈顶节点的子节点中
          this.appendChild(this.tempNode)
          // 暂存该空格节点
          this.tempNode = new Text(' ')
        }
      }
    }
  }
}