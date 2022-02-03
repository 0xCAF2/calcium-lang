import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { createStr } from "../factory";
import FuncBody from "./funcBody";

/**
 * built-in `str()` function
 * @param args accept one argument
 * @param env
 * @returns a string value
 */
const str: FuncBody = (args: Expression[], env: Environment): InternalType => {
  const target = evaluate(args[0], env);
  const strValue = Reflect.get(target, Sym.description);
  return createStr(strValue);
};

export default str;
