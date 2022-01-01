import Environment from "../runtime/environment";
import Conditional from "./conditional";

/**
 * else control flow
 */
export default class Else extends Conditional {
  isSatisfied(env: Environment): boolean {
    // when an else command become the current line,
    // the runtime always enter this block.
    return true;
  }
}
