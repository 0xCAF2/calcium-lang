import * as Calcium from "../src";

it("Hello, World.", () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "=", ["var", "msg"], "Hello, World."],
    [1, [], "call", null, ["var", "print"], [["var", "msg"]]],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    expect(desc).toMatch("Hello, World.");
  });
  expect(runtime.env.currentLineIndex).toBe(0);
  expect(runtime.step()).toBe(Calcium.Status.Running);
  expect(runtime.step()).toBe(Calcium.Status.Running);
  expect(runtime.step()).toBe(Calcium.Status.Running);
  expect(runtime.step()).toBe(Calcium.Status.Terminated);
});

it("add two integers", () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "=", ["var", "a"], 7],
    [1, [], "=", ["var", "b"], ["+", ["var", "a"], 3]],
    [
      1,
      [],
      "call",
      null,
      ["var", "print"],
      [["+", ["var", "a"], ["var", "b"]]],
    ],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    expect(desc).toMatch("17");
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});

it("if statement", () => {
  const code = [
    [1, [], "#", "0_18"],
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
    [3, [], "=", ["var", "c"], "OK"],
    [1, [], "call", null, ["var", "print"], [["var", "c"]]],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    expect(desc).toMatch("None");
  });
  runtime.addBreakpoint(11);
  expect(runtime.run()).toBe(Calcium.Status.AtBreakpoint);
  expect(runtime.step()).toBe(Calcium.Status.Running);
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
