
import * as Calcium from "../src";

it("class.py", () => {
  const code = [
  [1, [], "#", "0.19"],
  [1, [], "class", "MyClass", "object"],
    [2, [], "def", "__init__", ["self", "name"]],
      [3, [], "=", ["attr", "self", "name"], ["var", "name"]],
    [2, [], "def", "greet", ["self"]],
      [3, [], "return", ["+", ["+", "Hello, ", ["attr", "self", "name"]], "."]],
  [1, [], "call", ["var", "c"], ["var", "MyClass"], ["John"]],
  [1, [], "call", ["var", "msg"], ["attr", "c", "greet"], []],
  [1, [], "call", null, ["var", "print"], [["==", ["var", "msg"], "Hello, John."]]],
  [1, [], "end"]
] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch('True');
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
