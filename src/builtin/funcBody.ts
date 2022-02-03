import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";

/**
 * signature for the body of a built-in function.
 */
// type FuncBody = (args: Expression[], env: Environment) => InternalType;
type FuncBody = (args: Expression[], env: Environment) => InternalType;

export default FuncBody;
