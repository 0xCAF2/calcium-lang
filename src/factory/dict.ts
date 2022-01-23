import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import { createInt, createList, createStr, None } from ".";
import { AttributeNotFound, KeyMustBeStrOrInt } from "../error";
import createBuiltinMethod from "./builtinMethod";

export default function createDict(value: {}): InternalType {
  let map = new Map<string | number, InternalType>();
  const self = new Proxy(
    {},
    {
      get(target, property, receiver) {
        if (property === Sym.evaluate)
          return (env: Environment) => {
            const newMap = new Map<string | number, InternalType>();
            map.forEach((v, k, _) => {
              newMap.set(k, v);
            });
            map = newMap;
            return self;
          };
        else if (property === Sym.value) return map;
        else if (property === Sym.iterator) {
          let counter = 0;
          const keys = new Array(...map.keys());
          return {
            next(): InternalType | undefined {
              if (counter >= keys.length) return undefined;
              else return map.get(keys[counter++]) as InternalType;
            },
          };
        } else if (property === Sym.len) return createInt(map.size);
        else if (property === Sym.subscript)
          return (key: InternalType, value?: InternalType): InternalType => {
            let keyValue = Reflect.get(key, Sym.value);
            if (typeof keyValue !== "string" && typeof keyValue !== "number") {
              throw new KeyMustBeStrOrInt();
            }
            if (value === undefined) {
              const val = map.get(keyValue);
              if (val === undefined) return None;
              else return val;
            } else {
              map.set(keyValue, value);
              return None;
            }
          };
        else if (property === "keys") {
          return createBuiltinMethod({
            name: "keys",
            body: (args, env) => {
              const keys = new Array(...map.keys()).map((k) => {
                if (typeof k === "string") {
                  return createStr(k);
                } else {
                  return createInt(k);
                }
              });
              return createList(keys);
            },
          });
        }
        throw new AttributeNotFound(property.toString());
      },
    }
  ) as InternalType;
  return self;
}
