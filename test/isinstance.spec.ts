
import * as Calcium from "../src";

it("isinstance.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "class", "C", "object"],
    [2, [], "pass"],
  [1, [], "call", ["var", "c"], ["var", "C"], []],
  [1, [], "call", ["var", "r"], ["var", "isinstance"], [["var", "c"], ["var", "C"]]],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "call", ["var", "rs"], ["var", "isinstance"], [["var", "s"], ["var", "str"]]],
  [1, [], "call", null, ["var", "print"], [["and", ["var", "r"], ["var", "rs"]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
