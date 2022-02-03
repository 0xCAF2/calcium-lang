import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import createIterator from "../factory/iterator";
import { createInt } from "../factory";
import createTuple from "../factory/tuple";
import FuncBody from "./funcBody";

/**
 * built-in `enumerate()` function
 * @param args accept an argument that is iterable
 * @param env
 * @returns a tuple with an index and an element
 */
const enumerate: FuncBody = (
  args: Expression[],
  env: Environment
): InternalType => {
  const iterable = evaluate(args[0], env);
  const iterator = Reflect.get(iterable, Sym.iter);
  const enumerateObject = createIterator({
    name: "enumerate object",
    next: (index) => {
      const nextValue = Reflect.get(iterator, Sym.next);
      if (nextValue === null) return null;
      else return createTuple(createInt(index), nextValue);
    },
  });
  return enumerateObject;
};

export default enumerate;
