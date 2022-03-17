import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { Expression, Reference } from "../expression";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";

export default function createMethod({
  funcObj,
  boundObj,
}: {
  funcObj: InternalType;
  boundObj: InternalType;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.call) {
          return (args: Expression[], env: Environment) => {
            args.unshift(boundObj);
            Reflect.get(funcObj, Sym.call)(args, env);
          };
        } else if (property === Sym.class) return "method";
        throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
