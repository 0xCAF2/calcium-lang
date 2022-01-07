
import * as Calcium from "../src";

it("slice.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "l"], [[0, 1, 2, 3]]],
  [1, [], "=", ["var", "a"], ["sub", ["var", "l"], -1, null]],
  [1, [], "=", ["var", "r"], ["==", ["sub", ["var", "a"], 0], 3]],
  [1, [], "call", ["var", "b"], ["var", "len"], [["sub", ["var", "l"], null, null]]],
  [1, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "b"], 4]]],
  [1, [], "call", null, ["var", "print"], [["var", "r"]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
