import { AttributeNotFound } from "../error";
import { InternalType } from "../type";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";

/**
 *
 * @param value
 * @returns an internal representation of a string
 */
export default function createStr(value: string): InternalType {
  const self = new Proxy(
    {},
    {
      get(target, property) {
        if (property === Sym.description) return value;
        else if (property === Sym.value) return value;
        else if (property === Sym.evaluate) return (env: Environment) => self;
        else if (property === Sym.iterator) {
          let counter = 0;
          return {
            next(): InternalType | undefined {
              if (counter >= value.length) return undefined;
              else return createStr(value[counter++]);
            },
          };
        } else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
