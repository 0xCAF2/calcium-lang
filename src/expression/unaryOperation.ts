import * as Expr from "./index";

export default class UnaryOperation {
  constructor(
    public readonly operator: string,
    public readonly operand: Expr.Expression
  ) {}
}
