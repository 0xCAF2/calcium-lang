import { Command } from ".";
import Environment from "../runtime/environment";

/**
 * represent a comment line
 */
export default class Comment implements Command {
  constructor(public readonly text: string | null) {}
  execute(env: Environment): void {
    // Do nothing.
  }
}
