const fs = require('fs')
const path = require('path')

function read(filename: string) {
  return fs.readFileSync(path.resolve('test/_files', filename), { encoding: 'utf8' })
}

export const file1 = read('1.md')