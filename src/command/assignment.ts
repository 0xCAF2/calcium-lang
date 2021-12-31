import * as Cmd from ".";
import * as Expr from "../expression";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";

export default class Assignment implements Cmd.Command {
  constructor(
    public readonly lhs: Expr.Reference,
    public readonly rhs: Expr.Expression
  ) {}
  execute(env: Environment) {
    const evaluate = Reflect.get(this.rhs, Sym.evaluate);
    const rhsValue = Reflect.apply(evaluate, this.rhs, [env]);
    this.lhs.assign(rhsValue, env);
  }
}
