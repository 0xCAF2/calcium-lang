
import * as Calcium from "../src";

it("forrange.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "=", ["var", "s"], "w"],
  [1, [], "for", ["var", "i"], ["call", ["var", "range"], [1, 4]]],
    [2, [], "*=", ["var", "s"], 2],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "s"], "wwwwwwww"]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
