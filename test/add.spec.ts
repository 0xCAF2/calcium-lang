
import * as Calcium from "../src";

it("add.py", () => {
  const code = [
  [1, [], "#", "0_18"],
  [1, [], "=", ["var", "a"], 7],
  [1, [], "=", ["var", "b"], ["+", ["var", "a"], 3]],
  [1, [], "=", ["var", "c"], ["+", ["var", "a"], ["var", "b"]]],
  [1, [], "ifs"],
    [2, [], "if", ["==", ["var", "b"], ["+", 7, 3]]],
      [3, [], "call", null, ["var", "print"], [["==", ["var", "c"], 17]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
