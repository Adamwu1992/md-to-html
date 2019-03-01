import { Tokenizer, IToken } from '../lib/parser/tokenizer'
import { EOF } from '../lib/utils'

const s = '# a'
const ss: Array<any> = []
const t = new Tokenizer((t: IToken) => {
  ss.push(t)
})

for(let i = 0, l = s.length; i < l; i++) {
  t.getInput(s[i])
}
t.getInput(EOF)

console.log(ss)