import Command from "./command";
import Environment from "../runtime/environment";

/**
 * Python's `pass` statement
 */
export default class Pass implements Command {
  /**
   * do nothing
   * @param env
   */
  execute(env: Environment) {}
}
