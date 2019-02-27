import { Tokenizer } from './tokenizer'

const s = '## hello world'

let res = []
const tokenizer = new Tokenizer(token => {
  res.push(token)
})

for(let i = 0, l = s.length; i < l; i++) {
  tokenizer.getInput(s[i])
}

test('run test:', () => {
  console.log('result', res)
  expect(res.length).toBeGreaterThan(0)
})