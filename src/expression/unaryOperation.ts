import { Expression } from "./index";

/**
 * use a unary operator and calculate
 */
export default class UnaryOperation {
  constructor(
    public readonly operator: string,
    public readonly operand: Expression
  ) {}
}
