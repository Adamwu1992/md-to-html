import { Tokenizer, IToken } from './tokenizer'
import { Transformer } from './transformer'
import { EOF } from '../utils'

export function parse(input: string): string {

  const transformer = new Transformer
  const tokenizer = new Tokenizer((token: IToken) => transformer.getInput(token))

  const l = input.length
  let i = 0
  while(i < l) {
    tokenizer.getInput(input[i])
    i++
  }
  tokenizer.getInput(EOF)

  return transformer.output
}