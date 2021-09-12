import {fromEvent, Subject, Observable} from 'rxjs'
import {
  take,
  filter,
  bufferCount,
  switchMap,
  startWith,
  timeoutWith,
} from 'rxjs/operators'
import {canUseDOM, isValidEvent, parseHotkeys, matchEvent} from './utils'

type Key = string
// {[key]: metadata}
type Metadata = Record<string, unknown>
type KeyBinding = Map<Key, Metadata>
// {[scope]: {[key]: metadata}}
type KeyBindings = Map<string, KeyBinding>
const maxSequenceTimeout = 1500
const keyBindings: KeyBindings = new Map()
const keyBindings$ = new Subject<KeyBindings>()

type HotkeyOptions = {
  /** scope key in key bindings, defaults to `global` */
  scope?: string
}

const ensureArray = <T>(x: T | T[]): T[] => (Array.isArray(x) ? x : [x])

export const createHotkey = (
  element?: HTMLElement | Document,
  {scope}: HotkeyOptions = {}
) => {
  if (!canUseDOM) {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    return () => () => {}
  }

  const keys$ = fromEvent<KeyboardEvent>(element!, 'keydown').pipe(
    filter(isValidEvent)
  )
  const scopeId = scope || 'global'

  return (
    keys: Key,
    handler: (...e: KeyboardEvent[]) => void,
    metadata?: Metadata
  ) => {
    let keyBinding = keyBindings.get(scopeId) as KeyBinding
    if (!keyBinding) {
      keyBinding = new Map()
      keyBindings.set(scopeId, keyBinding)
    }
    keyBinding.set(keys, {...metadata})
    keyBindings$.next(new Map(keyBindings) as KeyBindings)

    const hotkeys = parseHotkeys(keys)
    const matchEvents = filter((events: KeyboardEvent | KeyboardEvent[]) =>
      ensureArray(events).every((e, i) => matchEvent(e, hotkeys[i]))
    )
    const output$: Observable<KeyboardEvent | KeyboardEvent[]> =
      hotkeys.length === 1
        ? keys$.pipe(matchEvents)
        : keys$.pipe(
            take(1),
            switchMap((first$) =>
              keys$.pipe(
                startWith(first$),
                bufferCount(hotkeys.length, 1),
                timeoutWith(maxSequenceTimeout, output$)
              )
            ),
            matchEvents
          )

    const subscription = output$.subscribe((r) => {
      handler(...ensureArray(r))
    })
    return () => {
      keyBinding.delete(keys)
      if (!keyBinding.size) {
        keyBindings.delete(scopeId)
      }
      keyBindings$.next(new Map(keyBindings) as KeyBindings)
      subscription.unsubscribe()
    }
  }
}

export const getKeyBindings = () => keyBindings
export const listenKeyBindings = (handler: (bindings: KeyBindings) => void) => {
  const subscription = keyBindings$.subscribe(handler)
  return () => subscription.unsubscribe()
}

export const hotkey = createHotkey(canUseDOM ? document : undefined, {
  scope: 'global',
})
