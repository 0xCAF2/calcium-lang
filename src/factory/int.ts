import { AttributeNotFound } from "../error";
import { InternalType } from "../type";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";

/**
 *
 * @param value
 * @returns an internal type of an integer value
 */
export default function createInt(value: number): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.description) return value.toString();
        else if (property === Sym.value) return value;
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Symbol.toPrimitive) return (_: string) => value;
        else if (property === Sym.class) return "int";
        else throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
