import Environment from "../runtime/environment";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { AttributeNotFound } from "../error";

const object = new Proxy(
  {},
  {
    get(target, property, receiver) {
      if (property === Sym.name) return "object";
      else if (property === Sym.class) return self;
      else if (property === Sym.superclass) return null;
      else if (property === Sym.evaluate) return (env: Environment) => object;
      else throw new AttributeNotFound(property.toString());
    },
  }
) as InternalType;

export default object;
