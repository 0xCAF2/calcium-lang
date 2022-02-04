
import * as Calcium from "../src";

it("dict.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "d"], {}],
  [1, [], "=", ["sub", ["var", "d"], "k"], 7],
  [1, [], "=", ["var", "key"], "test"],
  [1, [], "=", ["sub", ["var", "d"], ["var", "key"]], ["+", ["sub", ["var", "d"], "k"], 3]],
  [1, [], "=", ["var", "keys"], ["call", ["attr", "d", "keys"], []]],
  [1, [], "=", ["var", "s"], ["call", ["var", "len"], [["var", "keys"]]]],
  [1, [], "=", ["var", "r"], ["and", ["==", ["var", "s"], 2], ["==", ["sub", ["var", "d"], "test"], 10]]],
  [1, [], "expr", ["call", ["var", "print"], [["var", "r"]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
