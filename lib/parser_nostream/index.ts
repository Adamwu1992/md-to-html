import { EOF } from './share'
import { Tokenizer, IToken } from './tokenizer'
import { Parser } from './parser'
// import { Transformer } from './transformer'

export function parse(input: string) {
  // const transformer = new Transformer
  const tokenizer = new Tokenizer

  const l = input.length
  let i = 0
  while(i < l) {
    tokenizer.getInput(input[i])
    i++
  }
  tokenizer.getInput(EOF)
  // return tokenizer.output

  const parser = new Parser

  const tokens: Array<IToken> = tokenizer.output

  console.log(tokens)
  const ll = tokens.length
  let j = 0
  while(j < ll) {
    parser.getInput(tokens[j])
    j++
  }

  return parser.output
}