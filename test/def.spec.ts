
import * as Calcium from "../src";

it("def.py", () => {
  const code = [
  [1, [], "#", "0_20"],
  [1, [], "def", "f", ["x", "y"]],
    [2, [], "return", ["==", ["var", "x"], ["var", "y"]]],
  [1, [], "=", ["var", "r"], ["call", ["var", "f"], [["+", 25, 2], ["+", 20, 7]]]],
  [1, [], "expr", ["call", ["var", "print"], [["var", "r"]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
