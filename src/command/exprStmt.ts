import Command from "./command";
import { Expression } from "../expression";
import Environment from "../runtime/environment";
import evaluate from "../util/evaluate";

/**
 * the command of an expression statement
 */
export default class ExprStmt implements Command {
  /**
   *
   * @param value an expression
   */
  constructor(public readonly value: Expression) {}
  execute(env: Environment) {
    evaluate(this.value, env);
  }
}
