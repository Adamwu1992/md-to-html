import { Tokenizer, IToken } from './tokenizer'
import { Transformer } from './transformer'

const s = `
## hello world  
good
`


let tokenizer: Tokenizer
let transformer: Transformer

beforeEach(() => {
  transformer = new Transformer
  tokenizer = new Tokenizer((token: IToken) => {
    transformer.getInput(token)
  })
})

test('Transform:', () => {
  let l = s.length
  let i = 0
  while(i < l) {
    tokenizer.getInput(s[i])
    i++
  }
  const output = transformer.output
  console.log(output)
  expect(output.length).toBeGreaterThan(0)
})