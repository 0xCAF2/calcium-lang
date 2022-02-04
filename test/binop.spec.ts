
import * as Calcium from "../src";

it("binop.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "x"], ["-", 7, 3]],
  [1, [], "=", ["var", "y"], ["**", ["var", "x"], 3]],
  [1, [], "=", ["var", "z"], ["//", ["var", "x"], 2]],
  [1, [], "=", ["var", "r"], false],
  [1, [], "ifs"],
    [2, [], "if", ["==", ["%", ["var", "z"], 2], 0]],
      [3, [], "=", ["var", "r"], ["not", ["var", "r"]]],
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
