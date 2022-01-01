import Command from "./command";
import * as Expr from "../expression";
import Environment from "../runtime/environment";
import evaluate from "../runtime/evaluate";

/**
 * the command of assignemnt
 */
export default class Assignment implements Command {
  /**
   *
   * @param lhs left hand side
   * @param rhs right hand side
   */
  constructor(
    public readonly lhs: Expr.Reference,
    public readonly rhs: Expr.Expression
  ) {}
  execute(env: Environment) {
    const rhsValue = evaluate(this.rhs, env);
    this.lhs.assign(rhsValue, env);
  }
}
