import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";

/**
 * a utility function that applies `evaluate` method to the expression
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
