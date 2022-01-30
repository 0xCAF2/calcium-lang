
import * as Calcium from "../src";

it("add.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "a"], 7],
  [1, [], "=", ["var", "b"], ["+", ["var", "a"], 3]],
  [1, [], "=", ["var", "c"], ["+", ["var", "a"], ["var", "b"]]],
  [1, [], "=", ["var", "r"], false],
  [1, [], "ifs"],
    [2, [], "if", ["==", ["var", "b"], ["+", 7, 3]]],
      [3, [], "=", ["var", "r"], ["or", ["var", "r"], ["==", ["var", "c"], 17]]],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "=", ["var", "ss"], ["+", ["sub", ["var", "s"], 0], ["sub", ["var", "s"], 2]]],
  [1, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "ss"], "ts"]]],
  [1, [], "=", ["var", "l1"], [[["var", "a"], ["var", "b"], ["var", "c"], ["sub", ["var", "s"], null, -1]]]],
  [1, [], "=", ["var", "l2"], [[["var", "ss"]]]],
  [1, [], "=", ["var", "l3"], ["+", ["var", "l1"], ["var", "l2"]]],
  [1, [], "=", ["var", "x"], ["call", ["var", "len"], [["var", "l3"]]]],
  [1, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "x"], 5]]],
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
