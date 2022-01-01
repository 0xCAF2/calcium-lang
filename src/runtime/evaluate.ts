import Environment from "./environment";
import { Expression, InternalType } from "../expression";
import { default as Sym } from "../symbol";

/**
 * an utility function that applies `evaluate` method to the expression
 * @param target
 * @param env
 * @returns
 */
export default function evaluate(
  target: Expression,
  env: Environment
): InternalType {
  const evaluate = Reflect.get(target, Sym.evaluate);
  return Reflect.apply(evaluate, target, [env]);
}
