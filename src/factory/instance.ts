import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import functionType from "./functionType";
import createMethod from "./method";
import createSuper from "./super";

export default function createInstance(src: {
  classObj: InternalType;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.class) return src.classObj;
        else if (property === Sym.super)
          return createSuper({ classObj: src.classObj, instance: self });

        const instanceProp = Reflect.get(target, property);
        if (instanceProp) return instanceProp;

        const classProp = Reflect.get(src.classObj, property);
        const __class__ = Reflect.get(classProp, Sym.class);
        if (__class__ === functionType) {
          return createMethod({ funcObj: classProp, boundObj: self });
        } else {
          return classProp;
        }
      },
      set(target, property, value, receiver) {
        return Reflect.set(target, property, value);
      },
    }
  ) as InternalType;
  return self;
}
