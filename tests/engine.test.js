"use strict";
const Calcium = require("../index");

test("all_command.json", () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "class", "MyBaseClass", "object"],
    [2, [], "def", "__init__", ["self"]],
    [3, [], "=", ["attr", "self", "n"], 42],
    [2, [], "def", "init", ["self", "x", "y"]],
    [3, [], "=", ["attr", "self", "x"], ["var", "x"]],
    [3, [], "=", ["attr", "self", "y"], [[["var", "y"]]]],
    [1, [], "class", "MySubClass", "MyBaseClass"],
    [2, [], "def", "__init__", ["self", "z"]],
    [
      3,
      [],
      "call",
      ["var", "s"],
      ["var", "super"],
      [
        ["var", "MySubClass"],
        ["var", "self"],
      ],
    ],
    [3, [], "call", null, ["attr", "s", "__init__"], []],
    [3, [], "=", ["attr", "self", "z"], {}],
    [3, [], "=", ["sub", ["attr", "self", "z"], "key"], ["var", "z"]],
    [1, [], "def", "test_class", ["x", "y", "z"]],
    [2, [], "call", ["var", "b"], ["var", "MyBaseClass"], []],
    [
      2,
      [],
      "call",
      null,
      ["attr", "b", "init"],
      [
        ["var", "x"],
        ["attr", "b", "n"],
      ],
    ],
    [2, [], "for each", "elem", ["attr", "b", "y"]],
    [3, [], "ifs"],
    [4, [], "if", ["==", ["%", ["attr", "b", "n"], 2], 0]],
    [5, [], "break"],
    [4, [], "elif", ["<", ["+", ["var", "elem"], 1], ["attr", "b", "n"]]],
    [5, [], "continue"],
    [4, [], "else"],
    [5, [], "=", ["var", "num"], 0],
    [5, [], "for range", "i", [1, 11]],
    [6, [], "+=", ["var", "num"], ["var", "i"]],
    [6, [], "return", ["var", "num"]],
    [3, [], "return", null],
    [2, [], "return", ["var", "b"]],
    [1, [], "call", ["var", "c"], ["var", "test_class"], [27, "Hello.", true]],
    [1, [], "call", null, ["var", "print"], [["attr", "c", "n"]]],
    [1, [], "end"],
  ];

  const engine = new Calcium.Engine(code);
  engine.setPrintFunction((desc) => {
    expect(desc).toMatch("42");
  });
  const result = engine.run();
  expect(result).toEqual(Calcium.Result.TERMINATED);
});

test('full_width.json', () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "=", ["var", "s"], "４２ 42"],
    [1, [], "=", ["var", "n"], 0],
    [1, [], "for each", "c", ["var", "s"]],
      [2, [], "call", ["var", "is_number"], ["attr", "c", "isdigit"], []],
      [2, [], "ifs"],
        [3, [], "if", ["var", "is_number"]],
          [4, [], "call", ["var", "a"], ["var", "int"], [["var", "c"]]],
          [4, [], "+=", ["var", "n"], ["var", "a"]],
    [1, [], "call", null, ["var", "print"], [["var", "n"]]],
    [1, [], "end"]
  ];

  const engine = new Calcium.Engine(code);
  engine.setPrintFunction((desc) => {
    expect(desc).toMatch("12");
  });
  const result = engine.run();
  expect(result).toEqual(Calcium.Result.TERMINATED);
});

test('negative_index.json', () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "=", ["var", "s"], "test"],
    [1, [], "call", null, ["var", "print"], [["sub", ["var", "s"], -2]]],
    [1, [], "=", ["var", "l"], [[0, 2, 4]]],
    [1, [], "call", null, ["var", "print"], [["sub", ["var", "l"], -1]]],
    [1, [], "end"]
  ];

  const engine = new Calcium.Engine(code);
  let counter = 0;
  engine.setPrintFunction((desc) => {
    if (counter === 0) {
      expect(desc).toMatch("s");
      ++counter;
    } else {
      expect(desc).toMatch("4");
    }
  });
  const result = engine.run();
  expect(result).toEqual(Calcium.Result.TERMINATED);
});

test('pop.json', () => {
  const code = [
    [1, [], "#", "0_18"],
    [1, [], "=", ["var", "l"], [[0, 1, 2]]],
    [1, [], "call", ["var", "v"], ["attr", "l", "pop"], []],
    [1, [], "call", null, ["var", "print"], [["var", "v"]]],
    [1, [], "call", null, ["attr", "l", "append"], [["var", "v"]]],
    [1, [], "call", ["var", "v"], ["attr", "l", "pop"], [0]],
    [1, [], "call", null, ["var", "print"], [["var", "v"]]],
    [1, [], "end"]
  ]

  const engine = new Calcium.Engine(code)
  let counter = 0
  engine.setPrintFunction((desc) => {
    if (counter === 0) {
      expect(desc).toMatch(/^2\n$/)
      ++counter
    } else {
      expect(desc).toMatch(/^0\n$/)
    }
  })
  const result = engine.run()
  expect(result).toEqual(Calcium.Result.TERMINATED)
})