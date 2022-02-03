import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import FuncBody from "./funcBody";

/**
 * built-in `len()` function
 * @param args accept an argument that is a list or a tuple or a str
 * @param env
 * @returns an integer value
 */
const len: FuncBody = (args: Expression[], env: Environment): InternalType => {
  const iterable = evaluate(args[0], env);
  const length = Reflect.get(iterable, Sym.len);
  return length; // should be an internal int value
};

export default len;
