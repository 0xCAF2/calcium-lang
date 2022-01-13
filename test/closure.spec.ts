
import * as Calcium from "../src";

it("closure.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "def", "f1", ["x"]],
    [2, [], "=", ["var", "y"], ["+", ["var", "x"], 3]],
    [2, [], "def", "f2", ["z"]],
      [3, [], "return", ["*", ["var", "y"], ["var", "z"]]],
    [2, [], "return", ["var", "f2"]],
  [1, [], "call", ["var", "f"], ["var", "f1"], [7]],
  [1, [], "call", ["var", "a"], ["var", "f"], [10]],
  [1, [], "call", null, ["var", "print"], [["==", ["var", "a"], 100]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
