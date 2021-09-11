/**
 * @jest-environment node
 */

import {hotkey, createHotkey} from '../src/hotkey'

describe('hotkey', () => {
  it('imports safely in Node', () => {
    expect(typeof document === 'undefined').toBeTruthy()
    // @ts-ignore
    expect(() => hotkey()()).not.toThrow()
    // @ts-ignore
    expect(() => createHotkey()()()).not.toThrow()
  })
})
