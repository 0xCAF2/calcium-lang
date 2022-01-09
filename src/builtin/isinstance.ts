import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { builtinFunctionOrMethod, type as typeObj } from "../factory";
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
  const instance = evaluate(args[0], env);
  const classOrType = evaluate(args[1], env);
  const __class__ = Reflect.get(classOrType, Sym.class);
  if (__class__ === typeObj) {
    const classOfInstance = Reflect.get(instance, Sym.class);
    return createBool(classOfInstance === classOrType);
  } else if (__class__ === builtinFunctionOrMethod) {
    const nameOfBuiltin = Reflect.get(classOrType, Sym.name);
    const nameOfType = Reflect.get(instance, Sym.class);
    return createBool(nameOfBuiltin === nameOfType);
  } else {
    throw new TypeError();
  }
}
