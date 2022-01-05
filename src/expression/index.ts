import { None } from "../factory";
import BinaryOperation from "./binaryOperation";
import { InternalType } from "../type";
import UnaryOperation from "./unaryOperation";
import Variable from "./variable";
import Attribute from "./attribute";

/**
 * any expression that contains an identifier
 */
export type Reference = Variable | Attribute;

/**
 * any expression that is not evaluated
 */
export type Expression =
  | BinaryOperation
  | InternalType
  | Reference
  | UnaryOperation
  | typeof None;

export { Attribute, BinaryOperation, UnaryOperation, Variable };
