import * as Type from "../type";
import { Command } from ".";
import Environment from "../runtime/environment";
import * as Expr from "../expression";

export default class Call implements Command {
  constructor(
    public readonly lhs: Expr.Reference | typeof Type.None,
    public readonly funcRef: Expr.Reference,
    public readonly args: Expr.Expression[]
  ) {}

  execute(env: Environment): void {
    const funcObj = this.funcRef.evaluate(env);
    if (funcObj instanceof Type.BuiltinFunc) {
      const result = funcObj.body(this.args, env);
      if (this.lhs !== Type.None) {
        (this.lhs as Expr.Reference).assign(result, env);
      }
    }
  }
}
