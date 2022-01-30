import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { AttributeNotFound } from "../error";
import object from "./object";
import createMethod from "./method";

export default function createSuper({
  classObj,
  instance,
}: {
  classObj: InternalType;
  instance: InternalType;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (typeof property === "string") {
          let superclass = Reflect.get(classObj, Sym.superclass);
          while (superclass !== object) {
            const funcObj = Reflect.get(superclass, property);
            if (funcObj) {
              return createMethod({ funcObj, boundObj: instance });
            }
            superclass = Reflect.get(classObj, Sym.superclass);
          }
        }
        throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
