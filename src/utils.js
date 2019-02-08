export const canUseDOM = typeof document !== 'undefined'

// https://mdn.io/KeyboardEvent/key/Key_Values#Modifier_keys
const isModifier = key => ['Control', 'Shift', 'Alt', 'Meta'].includes(key)

const isInput = el =>
  /^(input|textarea|select)$/i.test(el.tagName) || el.isContentEditable

export const isValidEvent = event =>
  !isInput(event.target) && !isModifier(event.key)

export const parseHotkeys = keys =>
  keys.split(' ').map(key => {
    const hotkey = {
      key: null,
      ctrlKey: false,
      altKey: false,
      metaKey: false,
      shiftKey: false,
    }
    return key
      .split('+')
      .map(k => k.toLowerCase())
      .reduce((o, k) => {
        if (k === 'ctrl') {
          o.ctrlKey = true
        } else if (k === 'alt') {
          o.altKey = true
        } else if (k === 'shift') {
          o.shiftKey = true
        } else if (k === 'meta') {
          o.metaKey = true
        } else {
          o.key = k
        }
        return o
      }, hotkey)
  })

const matchObject = (obj, partial) =>
  Object.keys(partial).every(k => partial[k] === obj[k])

const shiftedKeys = '~!@#$%^&*()_+{}|:"<>?'

export const matchEvent = (event, hotkey) =>
  matchObject(
    event,
    shiftedKeys.includes(hotkey.key) ? {...hotkey, shiftKey: true} : hotkey
  )
