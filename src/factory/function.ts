import Address from "../runtime/address";
import { Expression, Reference } from "../expression";
import Namespace from "../runtime/namespace";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import { invoke } from "../util";
import functionType from "./functionType";
import { None } from ".";

export default function createFunction(src: {
  address: Address;
  name: string;
  params: string[];
  parent: Namespace;
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
            invoke({
              address: src.address,
              args: f.args,
              env: f.env,
              lhs: f.lhs,
              params: src.params,
              parent: src.parent,
            });
          };
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.class) return functionType;
        throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
