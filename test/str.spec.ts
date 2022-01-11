
import * as Calcium from "../src";

it("str.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "call", ["var", "p"], ["attr", "s", "find"], ["e"]],
  [1, [], "call", ["var", "l"], ["attr", "s", "split"], ["s"]],
  [1, [], "call", ["var", "r"], ["var", "isinstance"], [["var", "l"], ["var", "list"]]],
  [1, [], "=", ["var", "r"], ["and", ["and", ["and", ["var", "r"], ["==", ["var", "p"], 1]], ["==", ["sub", ["var", "l"], 0], "te"]], ["==", ["sub", ["var", "l"], 1], "t"]]],
  [1, [], "call", null, ["var", "print"], [["var", "r"]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
