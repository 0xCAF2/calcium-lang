import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { createStr } from "../factory";

/**
 * built-in `str()` function
 * @param args accept one argument
 * @param env
 * @returns a string value
 */
export default function str(
  args: Expression[],
  env: Environment
): InternalType {
  const target = evaluate(args[0], env);
  const strValue = Reflect.get(target, Sym.description);
  return createStr(strValue);
}
