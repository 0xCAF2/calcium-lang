import Address from "../runtime/address";
import { Expression, Reference } from "../expression";
import Namespace from "../runtime/namespace";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { invoke } from "../util";

export default function createFunc(value: {
  address: Address;
  name: string;
  params: string[];
  parent: Namespace;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.name) return value.name;
        else if (property === Sym.call)
          return (f: {
            args: Expression[];
            env: Environment;
            lhs: Reference;
          }) => {
            invoke({
              address: value.address,
              args: f.args,
              env: f.env,
              lhs: f.lhs,
              params: value.params,
              parent: value.parent,
              returnValue: (env) => env.returnedValue,
            });
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
