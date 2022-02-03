import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { builtinFunctionOrMethod, typeObj } from "../factory";
import { createBool } from "../factory";
import FuncBody from "./funcBody";

/**
 * built-in `isinstance()` function
 * @param args accept two arguments. The first is an instance object and
 * the second is expected to be a class object.
 * @param env
 * @returns a boolean value
 */
const isinstance: FuncBody = (
  args: Expression[],
  env: Environment
): InternalType => {
  const instance = evaluate(args[0], env);
  const classOrType = evaluate(args[1], env);
  const __class__ = Reflect.get(classOrType, Sym.class);

  if (__class__ === typeObj) {
    // will try to compare a class with its instance
    let classOfInstance = Reflect.get(instance, Sym.class);

    // When the instance has a built-in type, Sym.class returns a string.
    if (typeof classOfInstance === "string") return createBool(false);

    while (classOfInstance !== null) {
      if (classOfInstance === classOrType) {
        return createBool(true);
      }
      // find the superclass
      classOfInstance = Reflect.get(classOfInstance, Sym.superclass);
    }
    return createBool(false);
  } else if (__class__ === builtinFunctionOrMethod) {
    // compare a built-in type with a value
    const nameOfBuiltin = Reflect.get(classOrType, Sym.name);
    const nameOfType = Reflect.get(instance, Sym.class);
    return createBool(nameOfBuiltin === nameOfType);
  } else {
    throw new TypeError();
  }
};

export default isinstance;
