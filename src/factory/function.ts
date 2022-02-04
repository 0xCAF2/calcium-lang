import Address from "../runtime/address";
import Namespace from "../runtime/namespace";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { invoke } from "../util";
import { Expression } from "../expression";

export default function createFunction({
  address,
  name,
  params,
  parent,
}: {
  address: Address;
  name: string;
  params: string[];
  parent: Namespace;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.name) return name;
        else if (property === Sym.call)
          return (args: Expression[], env: Environment) => {
            invoke({
              address: address,
              args,
              env,
              params: params,
              parent: parent,
            });
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.class) return "function";
        throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
