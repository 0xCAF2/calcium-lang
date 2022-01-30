import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { AttributeNotFound } from "../error";

export default function createIterator({
  name,
  next,
}: {
  name: string;
  next: (index: number) => InternalType | null;
}): InternalType {
  let i = 0;
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.iter) return self;
        else if (property === Sym.next) {
          return next(i++);
        } else if (property === Sym.class) {
          return name;
        }
        throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
