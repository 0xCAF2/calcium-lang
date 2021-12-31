import { Command } from ".";
import environment from "../runtime/environment";

/**
 * terminate a program
 */
export default class End implements Command {
  /**
   * do nothing.
   * @param env
   */
  execute(env: environment): void {
    // Do nothing
  }
}
