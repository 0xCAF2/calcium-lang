import { InternalType } from ".";
import { Primitive } from "../parser/jsonElement";

/**
 * the type of a value that has been evaluated
 */
type RawType = Primitive | InternalType[] | {};

export default RawType;
