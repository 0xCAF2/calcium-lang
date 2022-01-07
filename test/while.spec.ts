
import * as Calcium from "../src";

it("while.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "c"], 1],
  [1, [], "=", ["var", "n"], 0],
  [1, [], "while", ["<", ["var", "c"], 10]],
    [2, [], "+=", ["var", "n"], ["var", "c"]],
    [2, [], "+=", ["var", "c"], 1],
  [1, [], "call", null, ["var", "print"], [["==", ["var", "n"], 45]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
