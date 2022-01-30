import Command from "./command";
import * as Expr from "../expression";
import Environment from "../runtime/environment";
import evaluate from "../util/evaluate";
import { retrieveValue } from "../util";
import { InternalType } from "../type";

/**
 * the command of assignemnt
 */
export default class Assign implements Command {
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
    const rhs = evaluate(this.rhs, env);
    this.lhs.assign(rhs, env);
  }
}
