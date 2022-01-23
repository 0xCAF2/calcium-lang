import Environment from "../runtime/environment";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { AttributeNotFound } from "../error";

/**
 *
 * @param value
 * @returns the internal representation of a boolean value
 */
export default function createBool(value: boolean): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.description) return value ? "True" : "False";
        else if (property === Sym.value) return value;
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
