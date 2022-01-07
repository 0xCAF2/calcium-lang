import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { createBool } from "../factory";

/**
 * built-in `isinstance()` function
 * @param args accept two arguments. The first is an instance object and
 * the second is expected to be a class object.
 * @param env
 * @returns a boolean value
 */
export default function isinstance(
  args: Expression[],
  env: Environment
): InternalType {
  return createBool(false);
}
