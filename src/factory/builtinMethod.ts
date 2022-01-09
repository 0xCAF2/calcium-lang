import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { Expression } from "../expression";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { FuncBody } from "../builtin";

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
          return (f: { args: Expression[]; env: Environment }) => {
            src.body(f.args, f.env);
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
