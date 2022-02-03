import Namespace from "../runtime/namespace";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { default as typeObj } from "./typeObj";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { AttributeNotFound } from "../error";
import createInstance from "./instance";

export default function createClassObj({
  className,
  superclass,
  attributes,
}: {
  className: string;
  superclass: InternalType;
  attributes: Namespace;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.class) return typeObj;
        else if (property === Sym.name) return className;
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.call)
          return (args: Expression[], env: Environment): InternalType => {
            const instance = createInstance({ classObj: self });
            args.unshift(instance);
            // check whether __init__ is defined
            const __init__ = attributes.get("__init__");
            if (__init__) {
              env.returnedValue = instance;
              Reflect.get(__init__, Sym.call)(args, env);
            }
            return instance;
          };
        else if (property === Sym.superclass) return superclass;
        else if (typeof property === "string") {
          const attr = attributes.get(property);
          if (attr === undefined) {
            throw new AttributeNotFound(property);
          }
          return attr;
        }
        throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
