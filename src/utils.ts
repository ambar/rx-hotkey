export const canUseDOM = typeof document !== 'undefined'

// https://mdn.io/KeyboardEvent/key/Key_Values#Modifier_keys
const isModifier = (key: string) => ['Control', 'Shift', 'Alt', 'Meta'].includes(key)

const isInput = (el: HTMLElement) =>
  /^(input|textarea|select)$/i.test(el.tagName) || el.isContentEditable

export const isValidEvent = (event: KeyboardEvent) =>
  !isInput(event.target as HTMLElement) && !isModifier(event.key)

type ComboKey = {
  key: string,
  ctrlKey: boolean,
  altKey: boolean,
  metaKey: boolean,
  shiftKey: boolean,
}

export const parseHotkeys = (keys: string) =>
  keys.split(' ').map(key => {
    const hotkey = {
      key: '',
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

export const matchObject = <T extends {}>(obj: T, partial: T, comparator = (a: unknown, b: unknown) => a === b) =>
  // @ts-ignore Element implicitly has an 'any' type
  Object.keys(partial).every((k) => comparator(partial[k], obj[k]))

const shiftedKeys = '~!@#$%^&*()_+{}|:"<>?'

export const matchEvent = (event: KeyboardEvent, hotkey: ComboKey) =>
  matchObject(
    event as ComboKey,
    shiftedKeys.includes(hotkey.key) ? {...hotkey, shiftKey: true} : hotkey,
    (a, b) =>
      typeof a === 'string' && typeof b === 'string'
        ? a.toLowerCase() === b.toLowerCase()
        : a === b
  )
