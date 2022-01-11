import FuncBody from "./funcBody";
import print from "./print";
import len from "./len";
import isinstance from "./isinstance";
import str from "./str";
import int from "./int";
import list from "./list";

/**
 * built-in functions
 */
export const Functions: { [key: string]: FuncBody } = {
  int,
  isinstance,
  len,
  list,
  print,
  str,
};

export { FuncBody };
