import FuncBody from "./funcBody";
import print from "./print";
import len from "./len";
import isinstance from "./isinstance";

/**
 * built-in functions
 */
export const Functions: { [key: string]: FuncBody } = {
  isinstance,
  len,
  print,
};

export { FuncBody };
