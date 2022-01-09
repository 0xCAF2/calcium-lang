import FuncBody from "./funcBody";
import print from "./print";
import len from "./len";
import isinstance from "./isinstance";
import str from "./str";

/**
 * built-in functions
 */
export const Functions: { [key: string]: FuncBody } = {
  isinstance,
  len,
  print,
  str,
};

export { FuncBody };
