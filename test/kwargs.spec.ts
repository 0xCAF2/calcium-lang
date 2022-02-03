import * as Calcium from "../src";

it("kwargs.py", () => {
  const code = [
    [1, [], "#", "0_21"],
    [
      1,
      [],
      "expr",
      [
        "call",
        ["var", "print"],
        ["Hello", "World", ["kwarg", "sep", ", "], ["kwarg", "end", "?"]],
      ],
    ],
    [1, [], "end"],
  ] as any[];
  const runtime = new Calcium.Runtime(code);
  runtime.setOutputFunction((desc) => {
    console.log(desc);
    expect(desc).toMatch("Hello, World?");
  });
  expect(runtime.run()).toBe(Calcium.Status.Terminated);
});
