import { None } from "../factory";
import BinaryOperation from "./binaryOperation";
import UnaryOperation from "./unaryOperation";
import Variable from "./variable";

export type Reference = Variable;

/**
 * All objects in Calcium use a Proxy.
 */
export type InternalType = typeof Proxy;

export type Expression =
  | BinaryOperation
  | InternalType
  | Reference
  | UnaryOperation
  | typeof None;

export { BinaryOperation, UnaryOperation, Variable };
