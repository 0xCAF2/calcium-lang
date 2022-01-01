import { None } from "../factory";
import BinaryOperation from "./binaryOperation";
import { InternalType } from "../factory";
import UnaryOperation from "./unaryOperation";
import Variable from "./variable";

export type Reference = Variable;

export type Expression =
  | BinaryOperation
  | InternalType
  | Reference
  | UnaryOperation
  | typeof None;

export { BinaryOperation, InternalType, UnaryOperation, Variable };
