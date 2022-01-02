
import * as Calcium from "../src";

it("forrange.py", () => {
  const code = [
  [1, [], "#", "0_18"],
  [1, [], "=", ["var", "s"], "w"],
  [1, [], "for range", "i", [1, 4]],
    [2, [], "*=", ["var", "s"], 2],
  [1, [], "call", null, ["var", "print"], [["==", ["var", "s"], "wwwwwwww"]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
