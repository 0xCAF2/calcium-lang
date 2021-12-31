import { NoneType } from "../factory";
import Symbols from "../symbol";
import Variable from "./variable";

export type Reference = Variable;

/**
 * All objects in Calcium use a Proxy.
 */
export type InternalType = any;

export type Expression = InternalType | Reference | NoneType;

export { Variable };
