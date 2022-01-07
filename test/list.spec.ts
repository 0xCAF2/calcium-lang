
import * as Calcium from "../src";

it("list.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "r"], true],
  [1, [], "=", ["var", "l"], [[0, 2]]],
  [1, [], "call", null, ["attr", "l", "append"], [4]],
  [1, [], "call", ["var", "size"], ["var", "len"], [["var", "l"]]],
  [1, [], "=", ["var", "r"], ["and", ["and", ["var", "r"], ["==", ["var", "size"], 3]], ["==", ["sub", ["var", "l"], 1], 2]]],
  [1, [], "for each", "e", ["var", "l"]],
    [2, [], "ifs"],
      [3, [], "if", ["!=", ["%", ["var", "e"], 2], 0]],
        [4, [], "=", ["var", "r"], false],
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
