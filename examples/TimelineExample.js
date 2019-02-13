/** @jsx jsx */
import {jsx} from '@emotion/core'
import {useSpring} from 'react-spring'
import dialogPolyfill from 'dialog-polyfill'
import React, {Fragment, useRef, useState, useEffect} from 'react'
import {
  useHotkey,
  useScopedHotkey,
  useScopedHotkeyContextProvider,
  useKeyBindings,
} from './hooks'

export const useListHotkey = selector => {
  const getFocusableItems = () => [...selector()]

  const getActiveIndex = focusableItems =>
    focusableItems.findIndex(item => item.contains(document.activeElement))

  const focusNext = () => {
    const focusableItems = getFocusableItems()
    const activeIndex = getActiveIndex(focusableItems)
    const itemToFocus =
      activeIndex === -1 ? focusableItems[0] : focusableItems[activeIndex + 1]
    if (itemToFocus) {
      itemToFocus.tabIndex = -1
      itemToFocus.focus()
    }
  }

  const focusPrev = () => {
    const focusableItems = getFocusableItems()
    const activeIndex = getActiveIndex(focusableItems)
    const itemToFocus =
      activeIndex === -1 ? focusableItems[0] : focusableItems[activeIndex - 1]
    if (itemToFocus) {
      itemToFocus.tabIndex = -1
      itemToFocus.focus()
    }
  }

  useHotkey('j', focusNext, {name: 'Next item'})
  useHotkey('k', focusPrev, {name: 'Prev item'})
}

const Receptacle = props => (
  <div
    {...props}
    css={{
      margin: '0 auto',
      maxWidth: '980px',
      display: 'flex',
      flexDirection: 'column',
    }}
  />
)

const Button = props => (
  <button
    {...props}
    css={{
      display: 'flex',
      alignItems: 'center',
      height: '32px',
      outline: 'none',
      border: 'none',
      borderRadius: 3,
      backgroundColor: 'rgba(29, 33, 41, .04)',
      '&:focus, &:hover': {
        backgroundColor: 'rgba(29, 33, 41, .14)',
      },
    }}
  />
)

const Timeline = () => {
  const ulRef = useRef(null)
  useListHotkey(() => ulRef.current.querySelectorAll('li'))

  return (
    <ul ref={ulRef} css={{margin: 0, padding: 0}}>
      <TimelineItem />
      <TimelineItem />
      <TimelineItem />
      <TimelineItem />
      <TimelineItem />
    </ul>
  )
}

const TimelineItem = props => {
  const nodeRef = useRef(null)
  const ScopedHotKeyContextProvider = useScopedHotkeyContextProvider(nodeRef, {
    scope: 'content',
  })

  return (
    <ScopedHotKeyContextProvider>
      <li
        {...props}
        ref={nodeRef}
        css={{
          marginBottom: '.8em',
          padding: '12px',
          border: '1px solid #dddfe2',
          borderRadius: '3px',
          background: '#fff',
          listStyle: 'none',
          '&:focus-within': {
            outline: 'none',
            borderColor: '#5890ff',
          },
        }}
      >
        {/* avatar */}
        <a
          href="#"
          css={{
            display: 'block',
            width: 30,
            height: 30,
            borderRadius: '50%',
            backgroundColor: '#ddd',
          }}
        />
        {/* content */}
        <div css={{margin: '12px 0', height: 120, backgroundColor: '#eee'}} />
        {/* actions */}
        <div css={{display: 'flex', '& button': {marginRight: 10}}}>
          <LikeButton />
          <ShareButton />
        </div>
      </li>
    </ScopedHotKeyContextProvider>
  )
}

const LikeButton = () => {
  const [liked, setLiked] = useState(false)
  const handleLike = () => setLiked(!liked)
  useScopedHotkey('l', handleLike, {name: 'Like'})

  return (
    <Button onClick={handleLike}>
      <span>Like: {String(liked)}</span>
    </Button>
  )
}

const ShareButton = () => {
  const [shared, setShared] = useState(false)
  const handleShare = () => setShared(!shared)
  useScopedHotkey('s', handleShare, {name: 'Share'})

  return (
    <Button onClick={handleShare}>
      <span>Share: {String(shared)}</span>
    </Button>
  )
}

const HelpDialog = () => {
  const nodeRef = useRef(null)

  useEffect(() => {
    dialogPolyfill.registerDialog(nodeRef.current)
  })

  const showHelpDialog = () => {
    const dialog = nodeRef.current
    if (!dialog.open) dialog.showModal()
  }
  const hideHelpDialog = () => {
    const dialog = nodeRef.current
    if (dialog.open) dialog.close()
  }
  useHotkey('?', showHelpDialog, {name: 'Show help'})
  useHotkey('h e l p', showHelpDialog)

  return (
    <dialog
      ref={nodeRef}
      css={{
        position: 'fixed',
        // CSS polyfill
        margin: 0,
        border: '3px solid',
        top: '50%',
        left: '50%',
        transform: 'translate3d(-50%, -50%, 0)',
        maxWidth: '600px',
        background: 'white',
        '&:not([open])': {
          display: 'none',
        },
      }}
    >
      <KeyBindings />
      <footer css={{textAlign: 'center'}}>
        <button onClick={hideHelpDialog}>Close</button>
      </footer>
    </dialog>
  )
}

const SearchBar = () => {
  const inputRef = useRef(null)
  const focusInput = e => {
    e.preventDefault()
    inputRef.current.focus()
  }
  useHotkey('/', focusInput, {name: 'Search'})

  return (
    <div
      css={{
        display: 'flex',
        alignContent: 'center',
        justifyItems: 'center',
        height: '48px',
        backgroundColor: '#fff',
        boxShadow: '0 1px 3px rgba(26, 26, 26, 0.1)',
      }}
    >
      <Receptacle css={{justifyContent: 'center'}}>
        <input
          ref={inputRef}
          placeholder="Search"
          css={{
            padding: '.5em 1em',
            borderRadius: '3px',
            border: '1px solid #e6ecf0',
            minWidth: 220,
            outline: 'none',
          }}
        />
      </Receptacle>
    </div>
  )
}

const KeyBindings = () => {
  const keyBindings = useKeyBindings()

  return (
    <pre css={{'h2, h3': {textAlign: 'center'}}}>
      <h2>Type hotkey</h2>
      <div
        css={{
          display: 'flex',
          flexWrap: 'wrap',
        }}
      >
        {[...keyBindings].map(([scope, bindings]) => (
          <div
            key={scope}
            css={{
              width: '50%',
            }}
          >
            <h3 css={{textTransform: 'capitalize'}}>{scope}</h3>
            <dl
              css={{
                display: 'flex',
                flexWrap: 'wrap',
                kbd: {
                  padding: '2px 4px',
                  backgroundColor: '#fafafa',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  boxShadow: 'inset 0 -1px 0 #bbb',
                },
                dt: {
                  textAlign: 'right',
                },
                'dt, dd': {
                  margin: '0',
                  padding: '0 1em',
                  width: '50%',
                  whiteSpace: 'nowrap',
                  boxSizing: 'border-box',
                },
              }}
            >
              {[...bindings]
                .sort(([keysA], [keysB]) => keysA.localeCompare(keysB))
                .map(
                  ([keys, {name}]) =>
                    name && (
                      <Fragment key={keys}>
                        <dt>
                          <kbd>{keys}</kbd>
                        </dt>
                        <dd>{name}</dd>
                      </Fragment>
                    )
                )}
            </dl>
          </div>
        ))}
      </div>
    </pre>
  )
}

const GlobalScroll = () => {
  const [_, set] = useSpring(() => ({
    to: {top: 0},
    onFrame(e) {
      window.scrollTo({top: e.top})
    },
  }))
  const scrollToTop = () => set({top: 0})
  const scrollToBottom = () =>
    set({top: document.body.scrollHeight - window.innerHeight})

  useHotkey('g t', scrollToTop, {name: 'Scroll to top'})
  useHotkey('g b', scrollToBottom, {name: 'Scroll to bottom'})
  // ignores cases
  useHotkey('alt+home', scrollToTop)
  useHotkey('Alt+End', scrollToBottom)

  return null
}

export default () => {
  return (
    <div css={{backgroundColor: '#e9e9e9'}}>
      <SearchBar />
      <Receptacle css={{maxWidth: '600px'}}>
        <KeyBindings />
        <Timeline />
      </Receptacle>
      <footer css={{display: 'flex', height: 220}}>
        <Receptacle>Footer</Receptacle>
      </footer>
      <HelpDialog />
      <GlobalScroll />
    </div>
  )
}
