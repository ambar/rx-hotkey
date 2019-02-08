import {fromEvent, Subject} from 'rxjs'
import {
  take,
  filter,
  bufferCount,
  switchMap,
  startWith,
  timeoutWith,
} from 'rxjs/operators'
import {canUseDOM, isValidEvent, parseHotkeys, matchEvent} from './utils'

const maxSequenceTimeout = 1500
const keyBindings = new Map()
const keyBindings$ = new Subject()

export const createHotkey = (element, {scope} = {}) => {
  if (!canUseDOM) {
    return () => () => {}
  }

  const keys$ = fromEvent(element, 'keydown').pipe(filter(isValidEvent))
  const scopeId = scope || element

  return (keys, handler, options) => {
    let scopedKeyBindings = keyBindings.get(scopeId)
    if (!scopedKeyBindings) {
      scopedKeyBindings = new Map()
      keyBindings.set(scopeId, scopedKeyBindings)
    }
    scopedKeyBindings.set(keys, {...options})
    keyBindings$.next(new Map(keyBindings))

    const hotkeys = parseHotkeys(keys)
    const matchEvents = filter(events =>
      (Array.isArray(events) ? events : [events]).every((e, i) =>
        matchEvent(e, hotkeys[i])
      )
    )
    const output$ =
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

    const subscription = output$.subscribe(handler)
    return () => {
      scopedKeyBindings.delete(keys)
      if (!scopedKeyBindings.size) {
        keyBindings.delete(scopeId)
      }
      keyBindings$.next(new Map(keyBindings))
      subscription.unsubscribe()
    }
  }
}

export const getKeyBindings = () => keyBindings
export const listenKeyBindings = handler => {
  const subscription = keyBindings$.subscribe(handler)
  return () => subscription.unsubscribe()
}

export const hotkey = createHotkey(canUseDOM ? document : undefined, {
  scope: 'global',
})
