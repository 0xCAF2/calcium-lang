import Environment from "../runtime/environment";
import * as Expr from "../expression";
import Command from "./command";
import retrieveValue from "../runtime/retrieveValue";
import { Block, Kind } from "../runtime/block";

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
        }
      );
      block.enter(env);
    }
  }

  abstract isSatisfied(env: Environment): boolean;
}
