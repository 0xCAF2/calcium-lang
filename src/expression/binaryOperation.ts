import createInt from "../factory/int";
import Environment from "../runtime/environment";
import * as Expr from "./index";
import getValue from "../runtime/getValue";
import { InternalType } from "../expression";
import * as Kw from "../keyword";
import { OperationFailed } from "../error";
import { default as Sym } from "../symbol";

type Operate = (
  l: Expr.Expression,
  r: Expr.Expression,
  env: Environment
) => InternalType;

export default class BinaryOperation {
  static table: { [key: string]: Operate } = {
    [Kw.BinaryOperator.Addition]: (l, r, env) => {
      const valueL = getValue(l, env);
      const valueR = getValue(r, env);
      if (typeof valueL === "number" && typeof valueR === "number") {
        return createInt(valueL + valueR);
      }
      throw new OperationFailed();
    },
  };

  [Sym.evaluate](env: Environment): InternalType {
    return BinaryOperation.table[this.operator](this.left, this.right, env);
  }

  constructor(
    public readonly operator: string,
    public readonly left: Expr.Expression,
    public readonly right: Expr.Expression
  ) {}
}
