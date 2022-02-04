import { Expression, Reference } from "../expression";
import { FuncBody } from "../builtin";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import builtinFunctionOrMethod from "./builtinFunctionOrMethod";

/**
 *
 * @param name
 * @param body
 * @returns the internal representation of a built-in function
 */
export default function createBuiltinFunction({
  name,
  body,
}: {
  name: string;
  body: FuncBody;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.name) return name;
        else if (property === Sym.call)
          return (args: Expression[], env: Environment) => {
            const result = body(args, env);
            return result;
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.class) return builtinFunctionOrMethod;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
