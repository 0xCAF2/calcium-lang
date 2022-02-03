/**
 * Primitive types in JSON
 */
export type Primitive = number | string | boolean | null;

export type ArrayLiteral = [unknown[]];

export type DictLiteral = {};

/**
 * JSON representation of reference expressions in Calcium
 */
export type Reference = Attribute | Call | Subscript | Variable;

export type Syntax = Comma | KwArg;

/**
 * JSON representation of binary operators in Calcium
 */
export type BinaryOperation = [
  (
    | "+"
    | "-"
    | "*"
    | "**"
    | "/"
    | "//"
    | "%"
    | "=="
    | "!="
    | ">"
    | ">="
    | "<"
    | "<="
    | "and"
    | "or"
    | "is"
    | "is not"
    | "in"
    | "not in"
    | "&"
    | "|"
    | "^"
    | "<<"
    | ">>"
  ),
  Any,
  Any
];

export type UnaryOperation = ["~" | "-_" | "not", Any];

export type Attribute = ["attr", Reference, string];

export type Call = ["call", Reference, Any[]];

export type Comma = [",", ...Any[]];

export type KwArg = ["kwarg", string, Any];

export type Subscript = ["sub", Reference, IndexOrKey, SliceEnd?];

export type Variable = ["var", string];

export type IndexOrKey = number | string | Variable | Attribute;

export type SliceEnd = number | Variable;

/**
 * any JSON element for Calcium language
 */
export type Any =
  | Primitive
  | ArrayLiteral
  | DictLiteral
  | Reference
  | Syntax
  | BinaryOperation
  | UnaryOperation;
