
import * as Calcium from "../src";

it("class.py", () => {
  const code = [
  [1, [], "#", "0_21"],
  [1, [], "class", "MyClass"],
    [2, [], "def", "__init__", ["self", "name"]],
      [3, [], "=", ["attr", "self", "name"], ["var", "name"]],
    [2, [], "def", "greet", ["self"]],
      [3, [], "return", ["+", ["+", "Hello, ", ["attr", "self", "name"]], "."]],
  [1, [], "=", ["var", "c"], ["call", ["var", "MyClass"], ["John"]]],
  [1, [], "=", ["var", "msg"], ["call", ["attr", "c", "greet"], []]],
  [1, [], "expr", ["call", ["var", "print"], [["==", ["var", "msg"], "Hello, John."]]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True\n');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
