import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { Expression } from "../expression";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { FuncBody } from "../builtin";

export default function createBuiltinMethod({
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
        else throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
