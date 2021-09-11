# rx-hotkey

> A simple hotkey library.

[![Coverage Status](https://coveralls.io/repos/github/ambar/rx-hotkey/badge.svg?branch=master)](https://coveralls.io/github/ambar/rx-hotkey?branch=master)
[![npm version](https://badgen.net/npm/v/rx-hotkey)](https://www.npmjs.com/package/rx-hotkey)
[![minzipped size](https://badgen.net/bundlephobia/minzip/rx-hotkey)](https://bundlephobia.com/result?p=rx-hotkey)

## Install

```bash
npm install rx-hotkey
```

## Usage

To bind or unbind hotkeys:

```js
import {hotkey, createHotkey} from 'rx-hotkey'

// bind global hotkey
const unbind = hotkey('?', showHelp)
unbind()

// combo, with modifiers
hotkey('ctrl+r', (event) => {})
// sequences, space separated keys
hotkey('c i', (...events) => {})
hotkey('meta+k meta+v', (...events) => {})

// bind scoped hotkey
const scopedHotkey = createHotkey(sidebarElement)
const unbind = scopedHotkey('g h', goHome)
unbind()
```

To get or listen bindings:

```js
import {hotkey, getKeyBindings, listenKeyBindings} from 'rx-hotkey'

hotkey('ctrl+r', (event) => {}, {meta: 1})
const scopedHotkey = createHotkey(sidebarElement, {scope: 'sidebar'})
const unbind = scopedHotkey('g h', goHome, {meta: 2})

getKeyBindings()
/* =>
Map {
  "global" => Map {
    "ctrl+r" => Object {meta: 1},
  },
  "sidebar" => Map {
    "g h" => Object {meta: 2},
  },
}
*/

// listen changes of key bindings
const unlisten = listenKeyBindings(handler)
unlisten()
```

## Examples

- [TimelineExample](https://ambar.li/rx-hotkey/) React Hooks example
