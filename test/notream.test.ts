import { parse } from '../lib/parser_nostream'

it('No Crash:', () => {
  const input = `
    # title
    hello **world**

  `
  const tokens = parse(input)
  console.log(tokens)
  expect(tokens.length).toBeGreaterThan(1)
})