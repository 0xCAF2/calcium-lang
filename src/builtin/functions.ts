import Environment from "../runtime/environment";
import { InternalType } from "../type";
import * as JSONElementType from "../parser/jsonElement";

export type BuiltinFuncBody = (
  args: JSONElementType.Any[],
  env: Environment
) => InternalType;

export function print(
  args: JSONElementType.Any[],
  env: Environment
): InternalType {
  if (env.funcToOutput) {
    env.funcToOutput("Hello, World.");
  }
  return null;
}
