
import * as Calcium from "../src";

it("hello.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "=", ["var", "msg"], "Hello, World."],
  [1, [], "call", null, ["var", "print"], [["and", ["==", ["var", "msg"], "Hello, World."], ["!=", ["var", "msg"], "Hello, World!"]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
