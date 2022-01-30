import Command from "./command";
import Environment from "../runtime/environment";
import * as Expr from "../expression";
import evaluate from "../util/evaluate";

/**
 * eg. `+=`, `-=` or `*=`
 */
export default class CompoundAssign implements Command {
  /**
   *
   * @param operator same as the correspoding binary operator
   * @param lhs
   * @param rhs
   */
  constructor(
    public readonly operator: string,
    public readonly lhs: Expr.Reference,
    public readonly rhs: Expr.Expression
  ) {}
  execute(env: Environment) {
    const binOp = new Expr.BinaryOperation(this.operator, this.lhs, this.rhs);
    const updatedValue = evaluate(binOp, env);
    this.lhs.assign(updatedValue, env);
  }
}
