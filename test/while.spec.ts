
import * as Calcium from "../src";

it("while.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "c"], 1],
  [1, [], "=", ["var", "n"], 0],
  [1, [], "while", ["<", ["var", "c"], 10]],
    [2, [], "+=", ["var", "n"], ["var", "c"]],
    [2, [], "+=", ["var", "c"], 1],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "n"], 45]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
