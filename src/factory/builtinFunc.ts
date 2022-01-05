import { Expression } from "../expression";
import { FuncBody } from "../builtin";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";

/**
 *
 * @param name
 * @param body
 * @returns the internal representation of a built-in function
 */
export default function createBuiltinFunc(src: {
  name: string;
  body: FuncBody;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.name) return src.name;
        else if (property === Sym.body) return src.body;
        else if (property === Sym.call)
          return (f: { args: Expression[]; env: Environment }) =>
            src.body(f.args, f.env);
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
