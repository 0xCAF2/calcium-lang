import { None } from "../factory";
import BinaryOperation from "./binaryOperation";
import { InternalType } from "../type";
import UnaryOperation from "./unaryOperation";
import Attribute from "./attribute";
import Call from "./call";
import Subscript from "./subscript";
import Variable from "./variable";
import Comma from "./comma";
import KwArg from "./kwArg";

/**
 * any expression that contains an identifier
 */
export type Reference = Attribute | Comma | Subscript | Variable;

/**
 * any expression that is not evaluated
 */
export type Expression =
  | BinaryOperation
  | Call
  | KwArg
  | InternalType
  | Reference
  | UnaryOperation
  | typeof None;

export {
  Attribute,
  BinaryOperation,
  Call,
  Comma,
  KwArg,
  Subscript,
  UnaryOperation,
  Variable,
};
