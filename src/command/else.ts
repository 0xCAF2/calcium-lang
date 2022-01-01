import Environment from "../runtime/environment";
import Conditional from "./conditional";

export default class Else extends Conditional {
  isSatisfied(env: Environment): boolean {
    return true;
  }
}
