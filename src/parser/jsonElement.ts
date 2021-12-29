/**
 * Primitive types in JSON
 */
export type Primitive = number | string | boolean | null;

export type ArrayLiteral = [unknown[]];

export type DictLiteral = {};

export type Reference = Variable | Attribute | Subscript;

export type Variable = ["var", string];

export type Attribute = ["attr", Reference, string];

export type Subscript = ["sub", Reference, IndexOrKey, SliceEnd?];

export type IndexOrKey = number | string | Variable;

export type SliceEnd = number | Variable;

export type Any = Primitive | ArrayLiteral | DictLiteral | Reference;
