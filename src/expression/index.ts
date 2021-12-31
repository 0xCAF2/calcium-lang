import { NoneType } from "../type";
import Symbols from "../symbol";
import Variable from "./variable";

export type Reference = Variable;

/**
 * All objects in Calcium use a Proxy.
 */
export type InternalType = any; // TODO change here

export type Expression = InternalType | Reference | NoneType;

export { Variable };
