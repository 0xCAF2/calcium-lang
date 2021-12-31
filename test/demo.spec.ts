import * as Calcium from "../src";

it("Output 'Hello, World.'", () => {
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

it("Add two integers", () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "call", null, ["var", "print"], [["+", 7, 3]]],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    expect(desc).toMatch("10");
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
