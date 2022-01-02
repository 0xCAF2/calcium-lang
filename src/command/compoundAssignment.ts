import Command from "./command";
import Environment from "../runtime/environment";
import * as Expr from "../expression";
import evaluate from "../runtime/evaluate";

export default class CompoundAssignment implements Command {
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
