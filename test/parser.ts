import { Parser, Root } from '../lib/parser'
import {
  HeadTag,
  HeadTagEnd,
  ParagraphTag,
  ParagtaphTagEnd,
  Text,
  LineBreak,
  WhiteSpace
} from '../lib/tokenizer'

function getText(s: string): Array<Text> {
  const res: Array<Text> = []
  for (let i = 0, l = s.length; i < l; i++) {
    res.push(new Text(s[i]))
  }
  return res
}

const h2 = new HeadTag
h2.up()
h2.up()
const input = [
  h2,
  ...getText('hello'),
  new WhiteSpace,
  ...getText('world'),
  new HeadTagEnd,
  new ParagraphTag,
  ...getText('good'),
  new ParagtaphTagEnd,
  new ParagraphTag,
  ...getText('nice'),
  new ParagtaphTagEnd
]

const parser = new Parser

for (let i = 0, l = input.length; i < l; i++) {
  parser.getInput(input[i])
}
const output = <Root>(parser.getOutput())
console.log(output)