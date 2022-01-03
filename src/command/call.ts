import { None } from "../factory";
import Command from "./command";
import evaluate from "../util/evaluate";
import Environment from "../runtime/environment";
import * as Expr from "../expression";
import { default as Sym } from "../symbol";

/**
 * invoke a function or a method.
 * Call is not an expression but a statement in Calcium.
 */
export default class Call implements Command {
  /**
   *
   * @param lhs assigned the result
   * @param funcRef refer to a function or a method object
   * @param args arguments
   */
  constructor(
    public readonly lhs: Expr.Reference | typeof None,
    public readonly funcRef: Expr.Reference,
    public readonly args: Expr.Expression[]
  ) {}

  execute(env: Environment): void {
    const funcObj = evaluate(this.funcRef, env);
    Reflect.get(funcObj, Sym.call)({ args: this.args, env, lhs: this.lhs });
  }
}
