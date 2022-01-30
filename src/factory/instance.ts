import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import createMethod from "./method";

export default function createInstance({
  classObj,
}: {
  classObj: InternalType;
}): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.class) return classObj;

        const instanceProp = Reflect.get(target, property);
        if (instanceProp) return instanceProp;

        const classProp = Reflect.get(classObj, property);
        const __class__ = Reflect.get(classProp, Sym.class);
        if (__class__ === "function") {
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
