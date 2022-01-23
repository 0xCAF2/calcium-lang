import Command from "./command";
import { Expression as Expr } from "../expression";
import Environment from "../runtime/environment";
import evaluate from "../util/evaluate";

/**
 * the command of an expression statement
 */
export default class Expression implements Command {
  /**
   *
   * @param value an expression
   */
  constructor(public readonly value: Expr) {}
  execute(env: Environment) {
    evaluate(this.value, env);
  }
}
