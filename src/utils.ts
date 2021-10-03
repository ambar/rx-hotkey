export const canUseDOM = typeof document !== 'undefined'

// https://mdn.io/KeyboardEvent/key/Key_Values#Modifier_keys
const isModifier = (key: string) =>
  ['Control', 'Shift', 'Alt', 'Meta'].includes(key)

const isInput = (el: HTMLElement) =>
  /^(input|textarea|select)$/i.test(el.tagName) || el.isContentEditable

export const isValidEvent = (event: KeyboardEvent) =>
  !isInput(event.target as HTMLElement) && !isModifier(event.key)

const modifiers = ['ctrl', 'alt', 'shift', 'meta'] as const
type Modifier = typeof modifiers[number]
type ComboKey = {key: string} & {
  [k in `${Modifier}Key`]: boolean
}

export const parseHotkeys = (keys: string) =>
  // eg. `ctrl+k f`
  keys.split(' ').map((key) => {
    // eg. `ctrl+k`
    const list = key.split('+').map((k) => k.toLowerCase())
    const parsed = {key: ''} as ComboKey
    modifiers.forEach((x) => {
      parsed[`${x}Key`] = list.includes(x)
    })
    list.some((x) => {
      if (!modifiers.includes(x as Modifier)) {
        parsed.key = x
        return true
      }
    })
    return parsed
  })

type PlainObject = Record<string, unknown>
export const matchObject = <T extends PlainObject>(
  obj: T,
  partial: T,
  comparator = (a: unknown, b: unknown) => a === b
) => Object.keys(partial).every((k) => comparator(partial[k], obj[k]))

const shiftedKeys = '~!@#$%^&*()_+{}|:"<>?'

export const matchEvent = (event: KeyboardEvent, hotkey: ComboKey) =>
  matchObject(
    event as unknown as PlainObject,
    shiftedKeys.includes(hotkey.key) ? {...hotkey, shiftKey: true} : hotkey,
    (a, b) =>
      typeof a === 'string' && typeof b === 'string'
        ? a.toLowerCase() === b.toLowerCase()
        : a === b
  )
