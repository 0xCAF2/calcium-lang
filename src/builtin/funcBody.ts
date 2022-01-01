import Environment from "../runtime/environment";
import * as Expr from "../expression";

/**
 * signature for the body of a built-in function.
 */
type FuncBody = (
  args: Expr.Expression[],
  env: Environment
) => Expr.InternalType;

export default FuncBody;
