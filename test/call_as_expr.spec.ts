
import * as Calcium from "../src";

it("call_as_expr.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "def", "f", ["x"]],
    [2, [], "return", ["+", ["var", "x"], 1]],
  [1, [], "=", ["var", "y"], ["call", ["var", "f"], [7]]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "y"], 8]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
