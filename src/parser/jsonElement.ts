/**
 * Primitive types in JSON
 */
export type Primitive = number | string | boolean | null;

export type ArrayLiteral = [unknown[]];

export type DictLiteral = {};

/**
 * JSON representation of reference expressions in Calcium
 */
export type Reference = Variable | Attribute | Subscript;

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

export type Variable = ["var", string];

export type Attribute = ["attr", Reference, string];

export type Subscript = ["sub", Reference, IndexOrKey, SliceEnd?];

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
  | BinaryOperation
  | UnaryOperation;
