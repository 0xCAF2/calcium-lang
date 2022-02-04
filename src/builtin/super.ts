import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { evaluate } from "../util";
import { createSuper } from "../factory";
import FuncBody from "./funcBody";

/**
 * built-in `super()` function
 * @param args accept two arguments (required)
 * @param env
 * @returns a super object
 */
const super_: FuncBody = (
  args: Expression[],
  env: Environment
): InternalType => {
  const classObj = evaluate(args[0], env);
  const self = evaluate(args[1], env);
  return createSuper({ classObj, instance: self });
};

export default super_;
