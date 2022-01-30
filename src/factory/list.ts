import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { evaluate, retrieveValue } from "../util";
import { createInt, None } from ".";
import { AttributeNotFound, ListIsEmpty } from "../error";
import createBuiltinMethod from "./builtinMethod";
import Slice from "../runtime/slice";
import createIterator from "./iterator";

export default function createList(value: Expression[]): InternalType {
  let list = value;
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate)
          return (env: Environment) => {
            list = list.map((v) => evaluate(v, env));
            return self;
          };
        else if (property === Sym.value) return list;
        else if (property === Sym.class) return "list";
        else if (property === Sym.description) {
          return `[${list
            .map((v) => {
              if (Reflect.get(v, Sym.class) === "str") {
                return `'${Reflect.get(v, Sym.description)}'`;
              } else {
                return Reflect.get(v, Sym.description);
              }
            })
            .join(", ")}]`;
        } else if (property === Sym.iter) {
          return createIterator({
            name: "list_iterator",
            next: (index) => {
              if (index >= list.length) return null;
              else return list[index] as InternalType;
            },
          });
        } else if (property === Sym.len) return createInt(list.length);
        else if (property === Sym.slice)
          return (
            lower: InternalType,
            upper: InternalType,
            value?: InternalType[]
          ): InternalType => {
            const slice = new Slice(list as InternalType[]);
            if (value === undefined) {
              return createList(slice.get(lower, upper) as InternalType[]);
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
              return list[idx] as InternalType;
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
        else if (property === "insert")
          return createBuiltinMethod({
            name: "insert",
            body: (args, env) => {
              const index = retrieveValue(args[0], env) as number;
              const value = evaluate(args[1], env);
              list.splice(index, 0, value);
              return None;
            },
          });
        else if (property === "pop")
          return createBuiltinMethod({
            name: "pop",
            body: (args, env) => {
              if (args.length === 0) {
                const value = list.pop();
                if (value === undefined) throw new ListIsEmpty();
                return value as InternalType;
              } else {
                const index = retrieveValue(args[0], env) as number;
                const value = list.splice(index, 1)[0];
                return value as InternalType;
              }
            },
          });
        throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
