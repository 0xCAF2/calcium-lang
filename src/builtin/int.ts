import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { createInt } from "../factory";

/**
 * built-in `int()` function
 * @param args accept one argument
 * @param env
 * @returns an integer value
 */
export default function int(
  args: Expression[],
  env: Environment
): InternalType {
  const target = evaluate(args[0], env);
  if (typeof target === "string") {
    const num = parseInt(target);
    return createInt(num);
  } else {
    throw new TypeError();
  }
}
