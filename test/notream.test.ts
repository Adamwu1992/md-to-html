import { parse } from '../lib/parser_nostream'
import { Tokenizer } from '../lib/parser_nostream/tokenizer'
import { EOF } from '../lib/parser_nostream/share'
import { file1 } from './_files'

describe('Tokenizer: ', () => {
  const tokenizer = (input: string) => {
    const t = new Tokenizer
    for (let i = 0; i < input.length; i++) {
      t.getInput(input[i])
    }
    t.getInput(EOF)
    return t.output
  }

  it('No crash from file:', () => {
    const output = tokenizer(file1)
    console.log(output)
    expect(1).toBe(1)
  })
})

describe('Parser:', () => {
  it('No crash:', () => {
    const input = `# title
    hello   _** w orld**_`
    const output = parse(input)
    console.log(output)
    console.log(JSON.stringify(output))
    expect(1).toBe(1)
  })

  it('No crash:', () => {
    const input = `# title
    he   llo   _**world**_`
    const output = parse(input)
    console.log(output)
    console.log(JSON.stringify(output))
    expect(1).toBe(1)
  })
})
