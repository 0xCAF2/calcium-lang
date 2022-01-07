import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { evaluate } from "../util";
import { createInt, None } from ".";
import { AttributeNotFound } from "../error";
import createBuiltinMethod from "./builtinMethod";
import Slice from "../runtime/slice";

export default function createList(value: Expression[]): InternalType {
  let list: InternalType[];
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate)
          return (env: Environment) => {
            list = value.map((v) => evaluate(v, env));
            return self;
          };
        else if (property === Sym.value) return list;
        else if (property === Sym.iterator) {
          let counter = 0;
          return {
            next(): InternalType | undefined {
              if (counter >= list.length) return undefined;
              else return list[counter++];
            },
          };
        } else if (property === Sym.len) return createInt(list.length);
        else if (property === Sym.slice)
          return (
            lower: InternalType,
            upper: InternalType,
            value?: InternalType[]
          ): InternalType => {
            const slice = new Slice(list);
            if (value === undefined) {
              return createList(slice.get(lower, upper));
            } else {
              slice.set(lower, upper, value);
              return None;
            }
          };
        else if (property === Sym.subscript)
          return (index: InternalType, value?: InternalType): InternalType => {
            let idx = Reflect.get(index, Sym.value) as number;
            if (idx < 0) idx += list.length;
            if (value === undefined) {
              return list[idx];
            } else {
              list[idx] = value;
              return None;
            }
          };
        else if (property === "append")
          return createBuiltinMethod({
            name: "append",
            body: (args, env) => {
              list.push(evaluate(args[0], env));
              return None;
            },
          });
        throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
