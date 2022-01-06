import FuncBody from "./funcBody";
import print from "./print";
import len from "./len";

/**
 * built-in functions
 */
export const Functions: { [key: string]: FuncBody } = {
  len,
  print,
};

export { FuncBody };
