
import * as Calcium from "../src";

it("prime.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "def", "is_remainder_zero", ["x", "y"]],
    [2, [], "=", ["var", "r"], ["==", ["%", ["var", "x"], ["var", "y"]], 0]],
    [2, [], "return", ["var", "r"]],
  [1, [], "=", ["var", "prime"], [[]]],
  [1, [], "for", ["var", "i"], ["call", ["var", "range"], [101]]],
    [2, [], "=", ["var", "j"], 2],
    [2, [], "while", true],
      [3, [], "ifs"],
        [4, [], "if", [">=", ["var", "j"], ["var", "i"]]],
          [5, [], "break"],
      [3, [], "ifs"],
        [4, [], "if", ["call", ["var", "is_remainder_zero"], [["var", "i"], ["var", "j"]]]],
          [5, [], "break"],
        [4, [], "else"],
          [5, [], "+=", ["var", "j"], 1],
    [2, [], "ifs"],
      [3, [], "if", ["==", ["var", "j"], ["var", "i"]]],
        [4, [], "expr", ["call", ["attr", "prime", "append"], [["var", "i"]]]],
  [1, [], "=", ["var", "result"], ["var", "prime"]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["call", ["var", "str"], [["var", "result"]]], "[2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]"]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
