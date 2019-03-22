import { EOF } from './share'
import { Tokenizer, IToken } from './tokenizer'
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
  return tokenizer.output

  // const tokens: Array<IToken> = tokenizer.output
  // const ll = tokens.length
  // let j = 0
  // while(j < ll) {
  //   transformer.getInput(tokens[j])
  //   j++
  // }

  // return transformer.output
}