import { print } from "./functions";
import { BuiltinFuncBody } from "./functions";

export const BuiltinFunctions: { [key: string]: BuiltinFuncBody } = {
  print,
};

export { BuiltinFuncBody } from "./functions";
