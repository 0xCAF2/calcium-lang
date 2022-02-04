
import * as Calcium from "../src";

it("tuple.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "n"], 0],
  [1, [], "for", ["var", "t"], ["call", ["var", "enumerate"], [[[0, 1, 2]]]]],
    [2, [], "+=", ["var", "n"], ["call", ["var", "len"], [["var", "t"]]]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "n"], 6]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
