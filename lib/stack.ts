export class Stack<T> {
  private data: Array<T>

  constructor(array?: Array<T>) {
    if (array instanceof Array) {
      this.data = array.slice(0)
    } else {
      this.data = []
    }
  }

  get size(): number {
    return this.data.length
  }

  push(t: T): number {
    this.data.push(t)
    return this.size
  }

  pop(): T {
    return this.data.pop()
  }

  top(): T {
    return this.data[this.size - 1]
  }

  bottom(): T {
    return this.data[0]
  }
}