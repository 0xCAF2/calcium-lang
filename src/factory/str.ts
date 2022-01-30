import { AttributeNotFound } from "../error";
import { InternalType } from "../type";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import Slice from "../runtime/slice";
import { createInt, createList } from ".";
import createBuiltinMethod from "./builtinMethod";
import { retrieveValue } from "../util";
import createIterator from "./iterator";

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
        else if (property === Sym.iter) {
          return createIterator({
            name: "str_iterator",
            next: (index) =>
              index >= value.length ? null : createStr(value[index]),
          });
        } else if (property === Sym.len) return createInt(value.length);
        else if (property === Sym.slice)
          return (lower: InternalType, upper: InternalType): InternalType => {
            const slice = new Slice(value);
            return createStr(slice.get(lower, upper) as string);
          };
        else if (property === Sym.subscript)
          return (index: InternalType): InternalType => {
            let idx = Reflect.get(index, Sym.value) as number;
            if (idx < 0) idx += value.length;
            return createStr(value.charAt(idx));
          };
        else if (property === Sym.class) return "str";
        else if (property === "find")
          return createBuiltinMethod({
            name: "find",
            body: (args, env) => {
              const substr = retrieveValue(args[0], env) as string;
              const index = value.indexOf(substr);
              return createInt(index);
            },
          });
        else if (property === "replace")
          return createBuiltinMethod({
            name: "replace",
            body: (args, env) => {
              const fromStr = retrieveValue(args[0], env) as string;
              const toStr = retrieveValue(args[1], env) as string;
              return createStr(value.replace(new RegExp(fromStr, "g"), toStr));
            },
          });
        else if (property === "split")
          return createBuiltinMethod({
            name: "split",
            body: (args, env) => {
              const sep = retrieveValue(args[0], env) as string;
              const result = value.split(sep);
              return createList(result.map((v) => createStr(v)));
            },
          });
        else throw new AttributeNotFound(property.toString());
      },
    }
  );
  return self as InternalType;
}
