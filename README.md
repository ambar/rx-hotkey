# rx-hotkey

> **WIP**: A simple hotkey library.

[![build status](https://badgen.net/travis/ambar/rx-hotkey)](https://travis-ci.org/ambar/rx-hotkey)
[![coverage status](https://badgen.net/codecov/c/github/ambar/rx-hotkey)](https://codecov.io/gh/ambar/rx-hotkey)
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

// combo, with modifers
hotkey('ctrl+r', event => {})
// sequences, space separated keys
hotkey('c i', events => {})
hotkey('meta+k meta+v', events => {})

// bind scoped hotkey
const scopedHotkey = createHotkey(sidebarElement)
const unbind = scopedHotkey('g h', goHome)
unbind()
```

To get or listen bindings:

```js
import {getKeyBindings, listenKeyBindings} from 'rx-hotkey'

getKeyBindings()
/* =>
Map {
  "global" => Map {
    "ctrl+r" => Object {},
  },
  "myScope" => Map {
    "g" => Object {},
  },
}
*/

// listen changes of key bindings
const unlisten = listenKeyBindings(handler)
unlisten()
```

## Examples

- [TimelineExample](https://ambar.li/rx-hotkey/) React Hooks example
