import Environment from "../runtime/environment";
import Command from "./command";
import { Block, Kind, Result } from "../runtime/block";

/**
 * a base class for `If`, `Elif` and `Else` commands
 */
export default abstract class Conditional implements Command {
  execute(env: Environment): void {
    if (this.isSatisfied(env)) {
      const block = new Block(
        Kind.IfElifElse,
        env.address,
        () => true,
        (env) => {
          env.address.shift(-2); // the indent is now same as Ifs command
          env.blocks.pop(); // therefore the Ifs block will be popped here
          return Result.Jumpped;
        }
      );
      block.willEnter(env);
    }
  }

  /**
   * a template method that returns whether the condition is satisfied
   * @param env
   */
  abstract isSatisfied(env: Environment): boolean;
}
