import React, {
  useEffect,
  useLayoutEffect,
  useContext,
  useState,
  useRef,
} from 'react'
import {hotkey, createHotkey, getKeyBindings, listenKeyBindings} from '..'

const useHandler = <T extends (...args: any[]) => any>(handler: T) => {
  const handlerRef = useRef<T>(handler)
  handlerRef.current = handler
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return useRef(((...args: any[]) => handlerRef.current(...args)) as T).current
}

type HotkeyParams = Parameters<typeof hotkey>
export const useHotkey = (
  key: HotkeyParams[0],
  handler: HotkeyParams[1],
  options: HotkeyParams[2] = {}
) => {
  const liveHandler = useHandler(handler)
  useEffect(
    () => hotkey(key, liveHandler, options),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key, liveHandler, ...Object.values(options)]
  )
}

type ScopedHotkeyContextValue = React.RefObject<typeof hotkey> | null
const ScopedHotkeyContext = React.createContext<ScopedHotkeyContextValue>(null)

export const useScopedHotkey = (
  key: HotkeyParams[0],
  handler: HotkeyParams[1],
  options: HotkeyParams[2] = {}
) => {
  const hotkeyRef = useContext(ScopedHotkeyContext)
  const liveHandler = useHandler(handler)
  useEffect(() => {
    if (!hotkeyRef) {
      console.warn('Could not find `ScopedHotkeyContext`')
      return
    }
    return hotkeyRef.current(key, liveHandler, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, liveHandler, ...Object.values(options)])
}

export const useScopedHotkeyContextProvider = (
  nodeRef: React.MutableRefObject<HTMLElement>,
  options = {}
) => {
  const createProvider = (): React.FC =>
    function Provider({children}) {
      return (
        <ScopedHotkeyContext.Provider value={hotkeyRef}>
          {children}
        </ScopedHotkeyContext.Provider>
      )
    }

  const hotkeyRef = useRef(null)
  const providerRef = useRef(createProvider())
  // initialize before consuming
  useLayoutEffect(() => {
    hotkeyRef.current = createHotkey(nodeRef.current, options)
    providerRef.current = createProvider()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeRef.current, ...Object.values(options)])

  return providerRef.current
}

export const useKeyBindings = () => {
  const [keyBindings, setKeyBindings] = useState(getKeyBindings())
  useEffect(() => listenKeyBindings(setKeyBindings), [])
  return keyBindings
}
