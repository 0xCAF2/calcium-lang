import Environment from "../runtime/environment";
import { Any } from "../type";
import * as JSONElementType from "../parser/jsonElement";

export type BuiltinFuncBody = (
  args: JSONElementType.Any[],
  env: Environment
) => Any;

export function print(args: JSONElementType.Any[], env: Environment): Any {
  if (env.funcToOutput) {
    env.funcToOutput("Hello, World.");
  }
  return null;
}
