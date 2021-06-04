# calcium-lang
Calcium language interpreter

## Calcium uses JSON-based code as input.

For example,

```javascript
const code = [
  [1, [], "=", ["var", "n"], 42],
  [1, [], "ifs"],
  [2, [], "if", ["<", ["var", "n"], 100]],
  [3, [], "call", null, ["var", "print"], ["Hello, World!"]],
  [1, [], "end"],
]
```

prints "Hello, World!".

Calcium supports primitive statements such as `if`, `for`, `while`, functions, and classes. [See here](https://sites.google.com/view/calcium-lang/commands).

## The interpreter is implemented by pure JavaScript.

You can use a calcium engine in a Web page or an embedded WebView.

```javascript
const calcium = require('calcium-lang')
const engine = new calcium.Engine(code) // code should be a JSON array.
```

creates the runtime engine. To output from print function set a callback as:

```javascript
engine.setPrintFunction((desc) => console.log(desc))
```

To execute the code, invoke

```javascript
engine.run() // Run the code.
```
