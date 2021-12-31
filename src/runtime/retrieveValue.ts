import * as Expr from "../expression";
import { Primitive } from "../parser/jsonElement";
import { default as Sym } from "../symbol";
import Environment from "./environment";
import evaluate from "./evaluate";

export default function retrieveValue(
  target: Expr.Expression,
  env: Environment
): Primitive {
  return Reflect.get(evaluate(target, env), Sym.value);
}
