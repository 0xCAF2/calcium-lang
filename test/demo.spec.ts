import * as Calcium from "../src";

it("Output 'Hello, World.'", () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "call", null, ["var", "print"], ["Hello, World."]],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setPrintFunction((desc) => {
    expect(desc).toMatch("Hello, World.");
  });
  expect(runtime.env.currentLineIndex).toBe(0);
  expect(runtime.step()).toBe(Calcium.Status.Terminated);
});
