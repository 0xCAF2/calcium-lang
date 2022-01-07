import Namespace from "../runtime/namespace";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { default as typeObj } from "./type";
import Environment from "../runtime/environment";
import { Expression, Reference } from "../expression";
import { AttributeNotFound } from "../error";
import createInstance from "./instance";
import { None } from ".";

export default function createClassObj(src: {
  className: string;
  superclass: InternalType;
  attributes: Namespace;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.class) return typeObj;
        else if (property === Sym.name) return src.className;
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.call)
          return (f: {
            args: Expression[];
            env: Environment;
            lhs: Reference | typeof None;
          }) => {
            const instance = createInstance({ classObj: self });
            f.args.unshift(instance);
            // check whether __init__ is defined
            const __init__ = src.attributes.get("__init__");
            if (__init__) {
              Reflect.get(__init__, Sym.call)(f);
              f.env.returnedValue = instance;
            } else {
              if (f.lhs !== None) {
                (f.lhs as Reference).assign(instance, f.env);
              }
            }
          };
        else if (typeof property === "string") {
          const attr = src.attributes.get(property);
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
