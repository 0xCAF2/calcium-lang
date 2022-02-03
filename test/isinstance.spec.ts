
import * as Calcium from "../src";

it("isinstance.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "class", "B"],
    [2, [], "pass"],
  [1, [], "class", "C", "B"],
    [2, [], "pass"],
  [1, [], "class", "A"],
    [2, [], "pass"],
  [1, [], "=", ["var", "c"], ["call", ["var", "C"], []]],
  [1, [], "=", ["var", "r"], ["call", ["var", "isinstance"], [["var", "c"], ["var", "C"]]]],
  [1, [], "=", ["var", "rb"], ["call", ["var", "isinstance"], [["var", "c"], ["var", "B"]]]],
  [1, [], "=", ["var", "ra"], ["call", ["var", "isinstance"], [["var", "c"], ["var", "A"]]]],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "=", ["var", "rs"], ["call", ["var", "isinstance"], [["var", "s"], ["var", "str"]]]],
  [1, [], "=", ["var", "rf"], ["call", ["var", "isinstance"], [["var", "s"], ["var", "C"]]]],
  [1, [], "=", ["var", "n"], 7],
  [1, [], "=", ["var", "ri"], ["call", ["var", "isinstance"], [["var", "n"], ["var", "int"]]]],
  [1, [], "expr", ["call", ["var", "print"], [["and", ["and", ["and", ["and", ["and", ["var", "r"], ["var", "rb"]], ["not", ["var", "ra"]]], ["var", "rs"]], ["not", ["var", "rf"]]], ["var", "ri"]]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
