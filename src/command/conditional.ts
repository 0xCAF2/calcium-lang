import Environment from "../runtime/environment";
import Command from "./command";
import { Block, Kind, Result } from "../runtime/block";

/**
 * a base class for `If`, `Elif` and `Else` commands
 */
export default abstract class Conditional implements Command {
  execute(env: Environment): void {
    if (this.isSatisfied(env)) {
      // should enter to this block
      const block = new Block(
        Kind.IfElifElse,
        env.address,
        () => true,
        (env) => {
          env.address.shift(-2);
          env.blocks.pop();
          return Result.Jumpped;
        }
      );
      block.enter(env);
    }
  }

  /**
   * a template method that returns whether the condition is satisfied
   * @param env
   */
  abstract isSatisfied(env: Environment): boolean;
}
