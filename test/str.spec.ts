
import * as Calcium from "../src";

it("str.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "=", ["var", "p"], ["call", ["attr", "s", "find"], ["e"]]],
  [1, [], "=", ["var", "l"], ["call", ["attr", "s", "split"], ["s"]]],
  [1, [], "=", ["var", "r"], ["call", ["var", "isinstance"], [["var", "l"], ["var", "list"]]]],
  [1, [], "=", ["var", "r"], ["and", ["and", ["and", ["var", "r"], ["==", ["var", "p"], 1]], ["==", ["sub", ["var", "l"], 0], "te"]], ["==", ["sub", ["var", "l"], 1], "t"]]],
  [1, [], "=", ["var", "s2"], ["call", ["attr", "s", "replace"], ["t", "l"]]],
  [1, [], "=", ["var", "r"], ["and", ["and", ["var", "r"], ["==", ["var", "s2"], "lesl"]], ["==", ["call", ["var", "len"], [["call", ["attr", "s", "replace"], ["t", "b"]]]], 4]]],
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
