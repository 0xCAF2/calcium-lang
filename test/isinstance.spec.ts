
import * as Calcium from "../src";

it("isinstance.py", () => {
  const code = [
  [1, [], "#", "0_20"],
  [1, [], "class", "C", "object"],
    [2, [], "pass"],
  [1, [], "=", ["var", "c"], ["call", ["var", "C"], []]],
  [1, [], "=", ["var", "r"], ["call", ["var", "isinstance"], [["var", "c"], ["var", "C"]]]],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "=", ["var", "rs"], ["call", ["var", "isinstance"], [["var", "s"], ["var", "str"]]]],
  [1, [], "=", ["var", "rf"], ["call", ["var", "isinstance"], [["var", "s"], ["var", "C"]]]],
  [1, [], "=", ["var", "n"], 7],
  [1, [], "=", ["var", "ri"], ["call", ["var", "isinstance"], [["var", "n"], ["var", "int"]]]],
  [1, [], "expr", ["call", ["var", "print"], [["and", ["and", ["and", ["var", "r"], ["var", "rs"]], ["not", ["var", "rf"]]], ["var", "ri"]]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
