
import * as Calcium from "../src";

it("for.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "=", ["var", "l"], [[]]],
  [1, [], "for", ["var", "c"], ["var", "s"]],
    [2, [], "expr", ["call", ["attr", "l", "append"], [["var", "c"]]]],
  [1, [], "=", ["var", "r"], ["==", ["call", ["var", "len"], [["var", "l"]]], 4]],
  [1, [], "=", ["var", "a"], [[0, 2, 4]]],
  [1, [], "for", [",", ["var", "i"], ["var", "e"]], ["call", ["var", "enumerate"], [["var", "a"]]]],
    [2, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "e"], ["*", ["var", "i"], 2]]]],
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
