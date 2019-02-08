/**
 * @jest-environment node
 */

import {hotkey, createHotkey} from '../src/hotkey'

describe('hotkey', () => {
  it('imports safely in Node', () => {
    expect(typeof document === 'undefined').toBeTruthy()
    expect(() => hotkey()()).not.toThrow()
    expect(() => createHotkey()()()).not.toThrow()
  })
})
