
import * as Calcium from "../src";

it("foreach.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "s"], "test"],
  [1, [], "=", ["var", "n"], 0],
  [1, [], "=", ["var", "r"], true],
  [1, [], "for each", "c", ["var", "s"]],
    [2, [], "ifs"],
      [3, [], "if", ["or", ["==", ["var", "n"], 0], ["==", ["var", "n"], 3]]],
        [4, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "c"], "t"]]],
      [3, [], "elif", ["==", ["var", "n"], 1]],
        [4, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "c"], "e"]]],
      [3, [], "else"],
        [4, [], "=", ["var", "r"], ["and", ["var", "r"], ["==", ["var", "c"], "s"]]],
    [2, [], "+=", ["var", "n"], 1],
  [1, [], "call", null, ["var", "print"], [["var", "r"]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
