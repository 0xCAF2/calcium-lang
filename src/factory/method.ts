import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { Expression, Reference } from "../expression";
import Environment from "../runtime/environment";

export default function createMethod(src: {
  funcObj: InternalType;
  boundObj: InternalType;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.call) {
          return (f: {
            args: Expression[];
            env: Environment;
            lhs: Reference;
          }) => {
            f.args.unshift(src.boundObj);
            Reflect.get(src.funcObj, Sym.call)(f);
          };
        }
      },
    }
  );
  return self as InternalType;
}
