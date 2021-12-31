import { None, Any } from "../factory";
import Variable from "./variable";

export type Reference = Variable;

/**
 * All objects in Calcium use a Proxy.
 */
export type InternalType = Any;

export type Expression = InternalType | Reference | typeof None;

export { Variable };
