import FuncBody from "./funcBody";
import print from "./print";
import enumerate from "./enumerate";
import len from "./len";
import isinstance from "./isinstance";
import str from "./str";
import int from "./int";
import list from "./list";
import range from "./range";
import super_ from "./super";

/**
 * built-in functions
 */
export const Functions: { [key: string]: FuncBody } = {
  enumerate,
  int,
  isinstance,
  len,
  list,
  print,
  range,
  super: super_,
  str,
};

export { FuncBody };
