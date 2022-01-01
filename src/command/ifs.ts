import Command from "./command";
import Environment from "../runtime/environment";
import { Block, Kind, Result } from "../runtime/block";

/**
 * the parent block of `If`, `Elif` and `Else`
 */
export default class Ifs implements Command {
  constructor() {}
  execute(env: Environment) {
    const block = new Block(
      Kind.Ifs,
      env.address,
      () => true,
      (env) => {
        env.address.shift(-1); // when all condition is not safisfied
        return Result.Exited;
      }
    );
    block.enter(env);
  }
}
