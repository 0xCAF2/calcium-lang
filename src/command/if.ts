import Environment from "../runtime/environment";
import { Expression } from "../expression";
import Conditional from "./conditional";
import retrieveValue from "../util/retrieveValue";

/**
 * if control flow
 */
export default class If extends Conditional {
  /**
   *
   * @param condition an arbitrary expression to determine whether
   * the statement shoule be executed
   */
  constructor(public readonly condition: Expression) {
    super();
  }
  isSatisfied(env: Environment): boolean {
    const value = retrieveValue(this.condition, env);
    const result = value ? true : false;
    return result;
  }
}
