import Environment from "../runtime/environment";
import * as Expr from "../expression";
import { default as Sym } from "../symbol";
import * as Type from "../factory";

/**
 * signature for the body of a built-in function.
 */
export type FuncBody = (args: Expr.Expression[], env: Environment) => Type.Any;

/**
 * the built-in print function
 * @param args positional arguments
 * @param env
 * @returns return None
 */
export function print(args: Expr.Expression[], env: Environment): Type.Any {
  const result: string[] = [];
  for (let elem of args) {
    result.push(Reflect.get(elem, Sym.description));
  }
  if (env.funcToOutput) {
    env.funcToOutput(result.join(" "));
  }
  return Type.None;
}
