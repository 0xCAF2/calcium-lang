
import * as Calcium from "../src";

it("slice.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "l"], [[0, 1, 2, 3]]],
  [1, [], "=", ["var", "a"], ["sub", ["var", "l"], null, -1]],
  [1, [], "=", ["var", "r"], ["==", ["sub", ["var", "a"], 1], 1]],
  [1, [], "=", ["var", "b"], ["call", ["var", "len"], [["sub", ["var", "l"], null, null]]]],
  [1, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "b"], 4]]],
  [1, [], "=", ["sub", ["var", "a"], null, 2], [[5]]],
  [1, [], "=", ["var", "c"], ["call", ["var", "len"], [["var", "a"]]]],
  [1, [], "=", ["var", "d"], ["call", ["var", "len"], [["var", "l"]]]],
  [1, [], "=", ["var", "r"], ["and", ["and", ["var", "r"], ["==", ["var", "c"], 2]], ["==", ["var", "d"], 4]]],
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
