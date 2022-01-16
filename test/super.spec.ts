
import * as Calcium from "../src";

it("super.py", () => {
  const code = [
  [1, [], "#", "0_20"],
  [1, [], "class", "B", "object"],
    [2, [], "def", "__init__", ["self", "n"]],
      [3, [], "=", ["attr", "self", "n"], ["var", "n"]],
  [1, [], "class", "C", "B"],
    [2, [], "def", "__init__", ["self", "n"]],
      [3, [], "=", ["var", "s"], ["call", ["var", "super"], []]],
      [3, [], "expr", ["call", ["attr", "s", "__init__"], [["var", "n"]]]],
  [1, [], "=", ["var", "c"], ["call", ["var", "C"], [7]]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["attr", "c", "n"], 7]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
