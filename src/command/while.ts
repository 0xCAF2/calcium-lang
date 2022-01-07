import Command from "./command";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { Block, Kind, Result } from "../runtime/block";
import retrieveValue from "../util/retrieveValue";

/**
 * `while` loop
 */
export default class While implements Command {
  /**
   *
   * @param condition if the value is `True`, then continue the loop
   */
  constructor(public readonly condition: Expression) {}
  execute(env: Environment) {
    const block = new Block(
      Kind.While,
      env.address,
      (env) => {
        const value = retrieveValue(this.condition, env);
        return value ? true : false;
      },
      (env) => {
        block.willEnter(env);
        return Result.Jumpped;
      }
    );
    block.willEnter(env);
  }
}
