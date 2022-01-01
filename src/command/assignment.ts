import Command from "./command";
import * as Expr from "../expression";
import Environment from "../runtime/environment";
import evaluate from "../runtime/evaluate";

export default class Assignment implements Command {
  constructor(
    public readonly lhs: Expr.Reference,
    public readonly rhs: Expr.Expression
  ) {}
  execute(env: Environment) {
    const rhsValue = evaluate(this.rhs, env);
    this.lhs.assign(rhsValue, env);
  }
}
