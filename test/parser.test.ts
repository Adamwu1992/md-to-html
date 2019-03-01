import { parse } from '../lib/parser'

function testSuits(input: string, output: string) {
  test(`Parse ${input}`, () => {
    const s = parse(input)
    expect(s).toBe(output)
  })
}

testSuits('# hello', '<h1>hello</h1>')