
import * as Calcium from "../src";

it("dict.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "d"], {}],
  [1, [], "=", ["sub", ["var", "d"], "k"], 7],
  [1, [], "=", ["var", "key"], "test"],
  [1, [], "=", ["sub", ["var", "d"], ["var", "key"]], ["+", ["sub", ["var", "d"], "k"], 3]],
  [1, [], "call", ["var", "keys"], ["attr", "d", "keys"], []],
  [1, [], "call", ["var", "s"], ["var", "len"], [["var", "keys"]]],
  [1, [], "=", ["var", "r"], ["and", ["==", ["var", "s"], 2], ["==", ["sub", ["var", "d"], "test"], 10]]],
  [1, [], "call", null, ["var", "print"], [["var", "r"]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
