/**
 * @jest-environment node
 */

import {hotkey, createHotkey} from '../src/hotkey'

describe('hotkey', () => {
  it('imports safely in Node', () => {
    expect(typeof document === 'undefined').toBeTruthy()
    // @ts-expect-error An argument for 'keys' was not provided.
    expect(() => hotkey()()).not.toThrow()
    // @ts-expect-error An argument for 'keys' was not provided.
    expect(() => createHotkey()()()).not.toThrow()
  })
})
