
import * as Calcium from "../src";

it("hello.py", () => {
  const code = [
  [1, [], "#", "0_18"],
  [1, [], "=", ["var", "msg"], "Hello, World."],
  [1, [], "call", null, ["var", "print"], [["==", ["var", "msg"], "Hello, World."]]],
  [1, [], "call", null, ["var", "print"], [["!=", ["var", "msg"], "Hello, World!"]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
