
import * as Calcium from "../src";

it("list.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "r"], true],
  [1, [], "=", ["var", "l"], [[0, 2]]],
  [1, [], "expr", ["call", ["attr", "l", "append"], [4]]],
  [1, [], "=", ["var", "size"], ["call", ["var", "len"], [["var", "l"]]]],
  [1, [], "=", ["sub", ["var", "l"], 0], "0"],
  [1, [], "=", ["var", "r"], ["and", ["and", ["and", ["var", "r"], ["==", ["var", "size"], 3]], ["==", ["sub", ["var", "l"], 1], 2]], ["==", ["call", ["var", "str"], [["var", "l"]]], "['0', 2, 4]"]]],
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
