
import * as Calcium from "../src";

it("if.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "a"], true],
  [1, [], "=", ["var", "b"], false],
  [1, [], "=", ["var", "c"], null],
  [1, [], "ifs"],
    [2, [], "if", ["or", ["var", "a"], ["var", "b"]]],
      [3, [], "ifs"],
        [4, [], "if", ["and", ["var", "a"], ["var", "b"]]],
          [5, [], "=", ["var", "c"], "NG 1"],
        [4, [], "elif", ["and", ["var", "b"], ["var", "b"]]],
          [5, [], "=", ["var", "c"], "NG 2"],
        [4, [], "elif", ["and", ["and", ["var", "a"], ["var", "a"]], ["var", "b"]]],
          [5, [], "=", ["var", "c"], "NG 3"],
    [2, [], "else"],
      [3, [], "=", ["var", "c"], "NG 4"],
  [1, [], "call", null, ["var", "print"], [["==", ["var", "c"], null]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
