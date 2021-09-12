import {
  hotkey,
  createHotkey,
  getKeyBindings,
  listenKeyBindings,
} from '../src/hotkey'

jest.useFakeTimers()

describe('hotkey', () => {
  it('binds hotkey', () => {
    const fn = jest.fn()
    const keydown = new KeyboardEvent('keydown', {key: '?', shiftKey: true})

    const unbind = hotkey('?', fn)
    document.dispatchEvent(keydown)
    expect(fn).toHaveBeenCalledWith(keydown)

    unbind()
    document.dispatchEvent(keydown)
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('ignores cases', () => {
    const fn = jest.fn()
    const keys = ['f1', 'home', 'arrowup', 'tab', 'escape', 'a', '1', ',']
    const list = keys.map((k) => hotkey(k, fn))
    for (const key of keys) {
      document.dispatchEvent(new KeyboardEvent('keydown', {key}))
      document.dispatchEvent(
        new KeyboardEvent('keydown', {key: key.toUpperCase()})
      )
    }
    expect(fn).toHaveBeenCalledTimes(keys.length * 2)
    list.forEach((n) => n())
  })

  it('binds modifiers', () => {
    const fn = jest.fn()
    const list = [
      hotkey('ctrl+r', fn),
      hotkey('ctrl+alt+r', fn),
      hotkey('ctrl+alt+shift+r', fn),
      hotkey('ctrl+alt+shift+meta+r', fn),
    ]
    document.dispatchEvent(
      new KeyboardEvent('keydown', {key: 'r', ctrlKey: true})
    )
    document.dispatchEvent(
      new KeyboardEvent('keydown', {key: 'r', ctrlKey: true, altKey: true})
    )
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'r',
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
      })
    )
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'r',
        ctrlKey: true,
        altKey: true,
        shiftKey: true,
        metaKey: true,
      })
    )
    expect(fn).toHaveBeenCalledTimes(4)
    expect(getKeyBindings()).toMatchSnapshot()

    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'r',
        metaKey: true,
      })
    )
    document.dispatchEvent(
      new KeyboardEvent('keydown', {
        key: 'r',
        altKey: true,
      })
    )
    expect(fn).toHaveBeenCalledTimes(4)

    list.forEach((n) => n())
    expect(getKeyBindings().size).toBe(0)
  })

  it('binds sequences', () => {
    const fn = jest.fn()
    const gKey = new KeyboardEvent('keydown', {key: 'g'})
    const cKey = new KeyboardEvent('keydown', {key: 'c'})

    const unbind = hotkey('g c', fn)
    document.dispatchEvent(gKey)
    document.dispatchEvent(cKey)
    expect(fn).toHaveBeenCalled()

    document.dispatchEvent(gKey)
    jest.advanceTimersByTime(1000)
    document.dispatchEvent(cKey)
    expect(fn).toHaveBeenCalledTimes(2)

    document.dispatchEvent(gKey)
    jest.advanceTimersByTime(2000)
    document.dispatchEvent(cKey)
    expect(fn).toHaveBeenCalledTimes(2)

    document.dispatchEvent(gKey)
    jest.advanceTimersByTime(2000)
    document.dispatchEvent(gKey)
    document.dispatchEvent(cKey)
    expect(fn).toHaveBeenCalledTimes(3)

    unbind()
  })
})

describe('createHotkey', () => {
  it('binds hotkey', () => {
    const fn = jest.fn()
    const keydown = new KeyboardEvent('keydown', {key: '?', shiftKey: true})

    const scopeEl = document.createElement('div')
    document.body.appendChild(scopeEl)
    const hotkey = createHotkey(scopeEl)

    const unbind = hotkey('?', fn)
    document.dispatchEvent(keydown)
    expect(fn).not.toHaveBeenCalled()
    expect(getKeyBindings()).toMatchSnapshot()

    scopeEl.dispatchEvent(keydown)
    expect(fn).toHaveBeenCalled()

    unbind()
    scopeEl.dispatchEvent(keydown)
    expect(fn).toHaveBeenCalledTimes(1)
    expect(getKeyBindings().size).toBe(0)

    scopeEl.remove()
  })

  it('lists key bindings', () => {
    const fn = jest.fn()
    const onBindingsChange = jest.fn()
    const scopeEl = document.createElement('div')
    document.body.appendChild(scopeEl)

    const unlisten = listenKeyBindings(onBindingsChange)
    const unbind = hotkey('f', fn, {meta: {foo: 1}})
    expect(onBindingsChange).toHaveBeenCalled()

    const scopedHotkey = createHotkey(scopeEl, {scope: 'sidebar'})
    const unbindScopedHotkey = scopedHotkey('g', fn, {meta: {bar: 1}})
    expect(onBindingsChange).toHaveBeenCalledTimes(2)
    expect(getKeyBindings()).toMatchSnapshot()

    unbind()
    expect(onBindingsChange).toHaveBeenCalledTimes(3)

    unbindScopedHotkey()
    expect(onBindingsChange).toHaveBeenCalledTimes(4)

    expect(getKeyBindings().size).toBe(0)
    unlisten()

    hotkey('f', fn)()
    expect(onBindingsChange).toHaveBeenCalledTimes(4)
  })
})
