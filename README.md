# calcium-lang
Calcium language interpreter

## Calcium uses JSON-based code as input.

```javascript
const code = [
  [1, [], "call", null, ["var", "print"], ["Hello, World!"]],
  [1, [], "end"],
]
```

prints "Hello, World!".

Calcium supports primitive statements such as `if`, `for`, `while`, functions, and classes. [See here](https://sites.google.com/view/calcium-lang/commands).

## Python's subset code can be translated to the Calcium code.

[There is a script](https://github.com/0xCAF2/py3ca) which reads a Python program and generates a JSON array. For example,

```python
def is_remainder_zero(x, y):
    r = (x % y) == 0
    return r

prime = []
for i in range(101):
    j = 2
    while True:
        if j >= i:
            break
        is_zero = is_remainder_zero(i, j)
        if is_zero:
            break
        else:
            j += 1
    if j == i:
        prime.append(i)
result = prime
print(result)
```

will be translated to:

```javascript
[
  [1, [], "def", "is_remainder_zero", ["x", "y"]],
    [2, [], "=", ["var", "r"], ["==", ["%", ["var", "x"], ["var", "y"]], 0]],
    [2, [], "return", ["var", "r"]],
  [1, [], "=", ["var", "prime"], [[]]],
  [1, [], "for range", "i", [101]],
    [2, [], "=", ["var", "j"], 2],
    [2, [], "while", true],
      [3, [], "ifs"],
        [4, [], "if", [">=", ["var", "j"], ["var", "i"]]],
          [5, [], "break"],
      [3, [], "call", ["var", "is_zero"], ["var", "is_remainder_zero"], [["var", "i"], ["var", "j"]]],
      [3, [], "ifs"],
        [4, [], "if", ["var", "is_zero"]],
          [5, [], "break"],
        [4, [], "else"],
          [5, [], "+=", ["var", "j"], 1],
    [2, [], "ifs"],
      [3, [], "if", ["==", ["var", "j"], ["var", "i"]]],
        [4, [], "call", null, ["attr", "prime", "append"], [["var", "i"]]],
  [1, [], "=", ["var", "result"], ["var", "prime"]],
  [1, [], "call", null, ["var", "print"], [["var", "result"]]],
  [1, [], "end"]
]
```

Calcium's one line corresponds to Python's.

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
