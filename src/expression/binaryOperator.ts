import * as Expr from "./index";

export default class BinaryOperator {
  constructor(
    public readonly operator: string,
    public readonly left: Expr.Expression,
    public readonly right: Expr.Expression
  ) {}
}
