
import * as Calcium from "../src";

it("recursive.py", () => {
  const code = [
  [1, [], "#", "0_20"],
  [1, [], "def", "fib", ["n"]],
    [2, [], "ifs"],
      [3, [], "if", ["or", ["==", ["var", "n"], 1], ["==", ["var", "n"], 2]]],
        [4, [], "return", 1],
      [3, [], "else"],
        [4, [], "return", ["+", ["call", ["var", "fib"], [["-", ["var", "n"], 1]]], ["call", ["var", "fib"], [["-", ["var", "n"], 2]]]]],
  [1, [], "=", ["var", "r"], ["call", ["var", "fib"], [9]]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "r"], 34]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
