import {matchObject} from '../src/utils'

describe('matchObject', () => {
  it('compares object', () => {
    expect(matchObject({foo: 1, bar: 2}, {foo: 1})).toBe(true)
    expect(matchObject({foo: 1}, {bar: 1})).toBe(false)
    expect(matchObject({foo: 1, bar: 2}, {foo: 1, baz: 2})).toBe(false)
  })

  it('uses custom comparator', () => {
    expect(matchObject({foo: 1, bar: 2}, {foo: 1}, Object.is)).toBe(true)
  })
})
