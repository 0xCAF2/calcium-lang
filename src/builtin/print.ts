import Environment from "../runtime/environment";
import * as Expr from "../expression";
import { None } from "../factory";
import Sym from "../symbol";

/**
 * the built-in print function
 * @param args positional arguments
 * @param env
 * @returns return None
 */
export default function print(
  args: Expr.Expression[],
  env: Environment
): Expr.InternalType {
  const result: string[] = [];
  for (let a of args) {
    const evaluate = Reflect.get(a, Sym.evaluate);
    const value = Reflect.apply(evaluate, a, [env]);
    result.push(Reflect.get(value, Sym.description));
  }
  if (env.funcToOutput) {
    env.funcToOutput(result.join(" "));
  }
  return None;
}
