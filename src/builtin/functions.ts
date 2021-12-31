import Environment from "../runtime/environment";
import * as Expr from "../expression";
import { default as Sym } from "../symbol";
import * as Type from "../type";

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
  for (let a of args) {
    const evaluate = Reflect.get(a, Sym.evaluate);
    const value = Reflect.apply(evaluate, a, [env]);
    result.push(Reflect.get(value, Sym.description));
  }
  if (env.funcToOutput) {
    env.funcToOutput(result.join(" "));
  }
  return Type.None;
}
