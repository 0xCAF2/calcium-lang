import { None } from "../factory";
import BinaryOperation from "./binaryOperation";
import { InternalType } from "../type";
import UnaryOperation from "./unaryOperation";
import Attribute from "./attribute";
import Call from "./call";
import Subscript from "./subscript";
import Variable from "./variable";

/**
 * any expression that contains an identifier
 */
export type Reference = Attribute | Subscript | Variable;

/**
 * any expression that is not evaluated
 */
export type Expression =
  | BinaryOperation
  | Call
  | InternalType
  | Reference
  | UnaryOperation
  | typeof None;

export {
  Attribute,
  BinaryOperation,
  Call,
  Subscript,
  UnaryOperation,
  Variable,
};
