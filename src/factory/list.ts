import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { evaluate } from "../util";
import { createInt, None } from ".";
import { AttributeNotFound } from "../error";
import createBuiltinMethod from "./builtinMethod";

export default function createList(value: Expression[]): InternalType {
  let list: InternalType[];
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate)
          return (env: Environment) => {
            list = [];
            for (let elem of value) {
              list.push(evaluate(elem, env));
            }
            return self;
          };
        else if (property === Sym.value) return list;
        else if (property === Sym.subscript)
          return (...indexes: number[]) => {
            if (indexes.length === 1) {
              return list[indexes[0]];
            } else {
              // TODO consider None
              return list.slice(indexes[0], indexes[1]);
            }
          };
        else if (property === Sym.len) return createInt(list.length);
        else if (property === Sym.iterator) {
          let counter = 0;
          return {
            next(): InternalType | undefined {
              if (counter >= list.length) return undefined;
              else return list[counter++];
            },
          };
        } else if (property === "append")
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
