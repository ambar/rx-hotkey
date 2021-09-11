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
type Bindings = Map<Key, object>
// {[scope]: {[key]: metadata}}
type ScopedBindings = Map<string, Bindings>
const maxSequenceTimeout = 1500
const keyBindings: Bindings = new Map()
const keyBindings$ = new Subject<ScopedBindings>()

type HotkeyOptions = {
  /** scope key in key bindings, defaults to `global` */
  scope?: string
}

const ensureArray = <T extends unknown>(x:  T): T[] => (Array.isArray(x) ? x : [x])

export const createHotkey = (element?: HTMLElement | Document, {scope}: HotkeyOptions = {}) => {
  if (!canUseDOM) {
    return () => () => {}
  }

  const keys$ = fromEvent<KeyboardEvent>(element!, 'keydown').pipe(filter(isValidEvent))
  const scopeId = scope || 'global'

  return (keys: Key, handler: (...e: KeyboardEvent[]) => void, metadata?: object) => {
    let scopedKeyBindings = keyBindings.get(scopeId) as Bindings
    if (!scopedKeyBindings) {
      scopedKeyBindings = new Map()
      keyBindings.set(scopeId, scopedKeyBindings)
    }
    scopedKeyBindings.set(keys, {...metadata})
    keyBindings$.next(new Map(keyBindings) as ScopedBindings)

    const hotkeys = parseHotkeys(keys)
    const matchEvents = filter((events: KeyboardEvent | KeyboardEvent[]) =>
      (ensureArray(events) as KeyboardEvent[]).every((e, i) =>
        matchEvent(e, hotkeys[i])
      )
    )
    const output$: Observable<KeyboardEvent | KeyboardEvent[]> =
      hotkeys.length === 1
        ? keys$.pipe(matchEvents)
        : keys$.pipe(
            take(1),
            switchMap(first$ =>
              keys$.pipe(
                startWith(first$),
                bufferCount(hotkeys.length, 1),
                timeoutWith(maxSequenceTimeout, output$)
              )
            ),
            matchEvents
          )

    const subscription = output$.subscribe(r => {
      handler(...(ensureArray(r) as KeyboardEvent[]))
    })
    return () => {
      scopedKeyBindings.delete(keys)
      if (!scopedKeyBindings.size) {
        keyBindings.delete(scopeId)
      }
      keyBindings$.next(new Map(keyBindings) as ScopedBindings)
      subscription.unsubscribe()
    }
  }
}

export const getKeyBindings = () => keyBindings
export const listenKeyBindings = (handler: (bindings: ScopedBindings) => void) => {
  const subscription = keyBindings$.subscribe(handler)
  return () => subscription.unsubscribe()
}

export const hotkey = createHotkey(canUseDOM ? document : undefined, {
  scope: 'global',
})


