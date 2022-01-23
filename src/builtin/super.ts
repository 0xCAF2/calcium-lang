import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { evaluate } from "../util";
import { createSuper } from "../factory";

/**
 * built-in `super()` function
 * @param args accept no argument
 * @param env
 * @returns a super object
 */
export default function super_(
  args: Expression[],
  env: Environment
): InternalType {
  const classObj = evaluate(args[0], env);
  const self = evaluate(args[1], env);
  return createSuper({ classObj, instance: self });
}
