# calcium-lang

Calcium language interpreter

## Calcium uses JSON-based code as input.

```javascript
const code = [
  [1, [], "#", "0_20"],
  [1, [], "expr", ["call", ["var", "print"], ["Hello, World."]]],
  [1, [], "end"],
];
```

prints "Hello, World!".

Calcium supports basic statements such as `if`, `while`, functions, and class definition. [See here](https://sites.google.com/view/calcium-lang/commands).

## Python's subset code can be translated to Calcium code.

[There is a script](https://github.com/0xCAF2/python2calcium) which reads a Python program and generates a JSON array. For example,

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
print(
    str(result)
    == "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]"
)
```

will be translated to:

```json

  [1, [], "#", "0_20"],
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
      [3, [], "=", ["var", "is_zero"], ["call", ["var", "is_remainder_zero"], [["var", "i"], ["var", "j"]]]],
      [3, [], "ifs"],
        [4, [], "if", ["var", "is_zero"]],
          [5, [], "break"],
        [4, [], "else"],
          [5, [], "+=", ["var", "j"], 1],
    [2, [], "ifs"],
      [3, [], "if", ["==", ["var", "j"], ["var", "i"]]],
        [4, [], "expr", ["call", ["attr", "prime", "append"], [["var", "i"]]]],
  [1, [], "=", ["var", "result"], ["var", "prime"]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["call", ["var", "str"], [["var", "result"]]], "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]"]]]],
  [1, [], "end"]
]
```

Calcium's one line corresponds to Python's one.

## The Calcium engine can be embedded in a Web page or a WebView.

```javascript
import * as Calcium from "calcium-lang";
const runtime = new Calcium.Runtime(code); // code should be a JSON array.
```

creates the runtime. To output from print function, set a callback as:

```javascript
runtime.setPrintFunction((desc) => console.log(desc));
```

To execute the code, invoke `run()` method.

```javascript
runtime.run(); // Run the code.
```
