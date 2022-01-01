import * as Expr from "../expression";
import { FuncBody } from "../builtin";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";

/**
 *
 * @param name
 * @param body
 * @returns the internal representation of a built-in function
 */
export default function createBuiltinFunc(
  name: string,
  body: FuncBody
): Expr.InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property) {
        if (property === Sym.name) return name;
        else if (property === Sym.body) return body;
        else if (property === Sym.call)
          return (args: Expr.Expression[], env: Environment) => body(args, env);
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as Expr.InternalType;
}
