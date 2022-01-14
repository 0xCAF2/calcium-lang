import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { SuperIsFailed } from "../error";

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
  const self = env.context.lookUp("self");
  if (self === undefined) {
    throw new SuperIsFailed();
  }
  return Reflect.get(self, Sym.super);
}
