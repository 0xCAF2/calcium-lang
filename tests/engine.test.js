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
  engine.run();
});