import { parse } from '../lib/parser_nostream'
import { Tokenizer } from '../lib/parser_nostream/tokenizer'
import { EOF } from '../lib/parser_nostream/share'

describe('Tokenizer: ', () => {
  const tokenizer = (input: string) => {
    const t = new Tokenizer
    for (let i = 0; i < input.length; i++) {
      t.getInput(input[i])
    }
    t.getInput(EOF)
    return t.output
  }

  it('No Crash:', () => {
    const input = '# hello'
    const output = tokenizer(input)
    console.log(output)
    expect(1).toBe(1)
  })

  it.only('No crash with break line:', () => {
    const input = `# title
    hello _**world**_`
    const output = tokenizer(input)
    console.log(output)
    expect(1).toBe(1)
  })
})
