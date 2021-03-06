import React, {
  useEffect,
  useLayoutEffect,
  useContext,
  useState,
  useCallback,
  useRef,
} from 'react'
import {hotkey, createHotkey, getKeyBindings, listenKeyBindings} from '..'

const useLiveHandler = handler => {
  const handlerRef = useRef()
  handlerRef.current = useCallback(handler, [handler])
  return (...args) => handlerRef.current(...args)
}

export const useHotkey = (key, handler, options = {}) => {
  const liveHandler = useLiveHandler(handler)
  useEffect(() => hotkey(key, liveHandler, options), [
    key,
    ...Object.values(options),
  ])
}

const ScopedHotkeyContext = React.createContext()

export const useScopedHotkey = (key, handler, options = {}) => {
  const hotkeyRef = useContext(ScopedHotkeyContext)
  const liveHandler = useLiveHandler(handler)
  useEffect(() => {
    if (!hotkeyRef) {
      console.warn('Could not find `ScopedHotkeyContext`')
      return
    }
    return hotkeyRef.current(key, liveHandler, options)
  }, [key, ...Object.values(options)])
}

export const useScopedHotkeyContextProvider = (nodeRef, options = {}) => {
  const createProvider = () => ({children}) =>
    React.createElement(ScopedHotkeyContext.Provider, {
      value: hotkeyRef,
      children,
    })

  const hotkeyRef = useRef(null)
  const providerRef = useRef(createProvider())
  // initialize before consuming
  useLayoutEffect(() => {
    hotkeyRef.current = createHotkey(nodeRef.current, options)
    providerRef.current = createProvider()
  }, [nodeRef.current, ...Object.values(options)])

  return providerRef.current
}

export const useKeyBindings = () => {
  const [keyBindings, setKeyBindings] = useState(getKeyBindings())
  useEffect(() => listenKeyBindings(setKeyBindings), [])
  return keyBindings
}
