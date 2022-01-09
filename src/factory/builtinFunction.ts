import { Expression, Reference } from "../expression";
import { FuncBody } from "../builtin";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { None } from ".";
import builtinFunctionOrMethod from "./builtinFunctionOrMethod";

/**
 *
 * @param name
 * @param body
 * @returns the internal representation of a built-in function
 */
export default function createBuiltinFunction(src: {
  name: string;
  body: FuncBody;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.name) return src.name;
        else if (property === Sym.call)
          return (f: {
            args: Expression[];
            env: Environment;
            lhs: Reference | typeof None;
          }) => {
            const result = src.body(f.args, f.env);
            if (f.lhs !== None) {
              const ref: Reference = f.lhs as Reference;
              ref.assign(result, f.env);
            }
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.class) return builtinFunctionOrMethod;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
