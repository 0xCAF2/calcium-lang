import Command from "./command";
import Environment from "../runtime/environment";

/**
 * terminate a program
 */
export default class End implements Command {
  /**
   * do nothing
   * @param env
   */
  execute(env: Environment) {}
}
