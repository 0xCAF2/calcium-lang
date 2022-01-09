import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { Expression, Reference } from "../expression";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { FuncBody } from "../builtin";
import None from "./none";

export default function createBuiltinMethod(src: {
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
              (f.lhs as Reference).assign(result, f.env);
            }
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
