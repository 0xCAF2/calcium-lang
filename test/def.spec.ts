
import * as Calcium from "../src";

it("def.py", () => {
  const code = [
  [1, [], "#", "0_20"],
  [1, [], "def", "f", ["x", "y"]],
    [2, [], "=", ["var", "n"], 0],
    [2, [], "while", ["<", ["var", "n"], 10]],
      [3, [], "ifs"],
        [4, [], "if", [">", ["var", "n"], ["var", "x"]]],
          [5, [], "return", ["*", ["var", "x"], 7]],
        [4, [], "elif", [">", ["var", "n"], ["var", "y"]]],
          [5, [], "return", ["*", ["var", "y"], 10]],
      [3, [], "+=", ["var", "n"], 1],
  [1, [], "=", ["var", "r"], ["call", ["var", "f"], [7, 5]]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "r"], 50]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
