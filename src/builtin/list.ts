import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { retrieveValue } from "../util";
import { createList, createStr } from "../factory";
import { NotIterable } from "../error";
import FuncBody from "./funcBody";

/**
 * built-in `list()` function
 * @param args accept an argument that is iterable
 * @param env
 * @returns a list object
 */
const list: FuncBody = (args: Expression[], env: Environment): InternalType => {
  const src = retrieveValue(args[0], env);
  if (typeof src === "string") {
    return createList(Array.from(src).map((v) => createStr(v)));
  } else if (Array.isArray(src)) {
    return createList(Array.from(src));
  } else if (src && typeof src === "object") {
    // src is a "dict" object.
    return createList(Object.keys(src).map((v) => createStr(v)));
  }
  throw new NotIterable();
};

export default list;
