import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { evaluate } from "../util";
import { createInt, None } from ".";
import { AttributeNotFound, TupleIsImmutable } from "../error";
import Slice from "../runtime/slice";

export default function createTuple(...value: Expression[]): InternalType {
  let tuple = value;
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate)
          return (env: Environment) => {
            tuple = tuple.map((v) => evaluate(v, env));
            return self;
          };
        else if (property === Sym.value) return tuple;
        else if (property === Sym.class) return "tuple";
        else if (property === Sym.description) {
          return `(${tuple
            .map((v) => {
              if (Reflect.get(v, Sym.class) === "str") {
                return `'${Reflect.get(v, Sym.description)}'`;
              } else {
                return Reflect.get(v, Sym.description);
              }
            })
            .join(", ")})`;
        } else if (property === Sym.iter) {
        } else if (property === Sym.len) return createInt(tuple.length);
        else if (property === Sym.slice)
          return (lower: InternalType, upper: InternalType): InternalType => {
            const slice = new Slice(tuple as InternalType[]);
            return createTuple(...(slice.get(lower, upper) as InternalType[]));
          };
        else if (property === Sym.subscript)
          return (index: InternalType, value?: InternalType): InternalType => {
            let idx = Reflect.get(index, Sym.value) as number;
            if (idx < 0) idx += tuple.length;
            if (value !== undefined) {
              throw new TupleIsImmutable();
            } else {
              return tuple[idx] as InternalType;
            }
          };
        throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
