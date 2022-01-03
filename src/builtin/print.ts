import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { None } from "../factory";
import Sym from "../symbol";
import { evaluate } from "../util";

/**
 * the built-in print function
 * @param args positional arguments
 * @param env
 * @returns return None
 */
export default function print(
  args: Expression[],
  env: Environment
): InternalType {
  const result: string[] = [];
  for (let a of args) {
    const evaluated = evaluate(a, env);
    result.push(Reflect.get(evaluated, Sym.description));
  }
  if (env.funcToOutput) {
    env.funcToOutput(result.join(" "));
  }
  return None;
}
