import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { Expression, Reference } from "../expression";
import Environment from "../runtime/environment";
import { AttributeNotFound } from "../error";
import object from "./object";
import createMethod from "./method";

export default function createSuper(src: {
  classObj: InternalType;
  instance: InternalType;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (typeof property === "string") {
          let superclass = Reflect.get(src.classObj, Sym.superclass);
          while (superclass !== object) {
            const funcObj = Reflect.get(superclass, property);
            if (funcObj) {
              return createMethod({ funcObj, boundObj: src.instance });
            }
          }
        }
        throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
