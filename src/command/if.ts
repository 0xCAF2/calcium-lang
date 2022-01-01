import Environment from "../runtime/environment";
import * as Expr from "../expression";
import Conditional from "./conditional";
import retrieveValue from "../runtime/retrieveValue";

/**
 * if control flow
 */
export default class If extends Conditional {
  constructor(public readonly condition: Expr.Expression) {
    super();
  }
  isSatisfied(env: Environment): boolean {
    const value = retrieveValue(this.condition, env);
    const result = value ? true : false;
    return result;
  }
}
