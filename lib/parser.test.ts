import { HeadTag, HeadTagEnd, Text, LineBreak, WhiteSpace } from './tokenizer'
import { Parser, Root } from './parser'
import { traverse } from './traverse'

const h = new HeadTag
h.up()
h.up()

function getText(s: string): Array<Text> {
  const res: Array<Text> = []
  for (let i = 0, l = s.length; i < l; i++) {
    res.push(new Text(s[i]))
  }
  return res
}

const input = [
  h,
  ...getText('hello'),
  new WhiteSpace,
  ...getText('world'),
  new HeadTagEnd,
  ...getText('good'),
  new LineBreak,
  ...getText('nice'),
]

it.only('Parser:', () => {
  const parser = new Parser

  for (let i = 0, l = input.length; i < l; i++) {
    parser.getInput(input[i])
  }

  const output = <Root>(parser.getOutput())
  console.log(output)
  traverse(output, console.log)
  expect(output.childNodes.length).toBeGreaterThan(0)
})