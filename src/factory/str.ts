import { AttributeNotFound } from "../error";
import { InternalType } from "../expression";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";

export default function createStr(value: string): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property) {
        if (property === Sym.description) return value;
        else if (property === Sym.value) return value;
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
