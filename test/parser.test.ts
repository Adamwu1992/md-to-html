import { parse } from '../lib/parser'

function testSuits(input: string, output: string) {
  test(`Parse ${input}:`, () => {
    const s = parse(input)
    expect(s).toBe(output)
  })
}

testSuits('# hello', '<h1>hello</h1>')

testSuits(
  `#title
  hello world
  `,
  '<h1>title</h1><p>hello world</p>'
)

testSuits(
  `# title
  end with two whitespace   
  good
  `,
  '<h1>title</h1><p>hello world</p><br/><p>good</p>'
)