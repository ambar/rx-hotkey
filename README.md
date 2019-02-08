# rx-hotkey

> **WIP**: A simple hotkey library.

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

- [TimelineExample](./examples/TimelineExample.js) React Hooks example
