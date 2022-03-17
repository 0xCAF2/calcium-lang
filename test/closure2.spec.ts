import * as Calcium from "../src";

it("closure2.py", () => {
  const code = [
    [1, [], "#", "0_21"],
    [1, [], "def", "outer", ["x", "y"]],
    [2, [], "def", "inner", ["z"]],
    [3, [], "return", ["*", ["+", ["var", "x"], ["var", "y"]], ["var", "z"]]],
    [2, [], "return", ["var", "inner"]],
    [1, [], "=", ["var", "f"], ["call", ["var", "outer"], [2, 5]]],
    [
      1,
      [],
      "expr",
      ["call", ["var", "print"], [["==", ["call", ["var", "f"], [3]], 21]]],
    ],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch("True\n");
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
