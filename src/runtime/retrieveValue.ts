import * as Expr from "../expression";
import { RawType } from "../factory";
import { default as Sym } from "../symbol";
import Environment from "./environment";
import evaluate from "./evaluate";

export default function retrieveValue(
  target: Expr.Expression,
  env: Environment
): RawType {
  return Reflect.get(evaluate(target, env), Sym.value);
}
