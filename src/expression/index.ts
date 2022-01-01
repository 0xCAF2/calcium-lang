import { None } from "../factory";
import BinaryOperation from "./binaryOperation";
import { InternalType } from "../factory";
import UnaryOperation from "./unaryOperation";
import Variable from "./variable";

/**
 * any expression that contains an identifier
 */
export type Reference = Variable;

/**
 * any expression that is not evaluated
 */
export type Expression =
  | BinaryOperation
  | InternalType
  | Reference
  | UnaryOperation
  | typeof None;

export { BinaryOperation, InternalType, UnaryOperation, Variable };
