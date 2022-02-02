import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { retrieveValue } from "../util";
import { createInt } from "../factory";

/**
 * built-in `int()` function
 * @param args accept an argument that is a number or a string
 * @param env
 * @returns an integer value
 */
export default function int(
  args: Expression[],
  env: Environment
): InternalType {
  const target = retrieveValue(args[0], env);
  if (typeof target === "string") {
    const num = parseInt(target);
    return createInt(num);
  } else if (typeof target === "number") {
    if (Number.isInteger(target)) return createInt(target);
    else return createInt(Math.floor(target));
  } else {
    throw new TypeError();
  }
}
