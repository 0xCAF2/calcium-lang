import Command from "./command";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { Block, Kind, Result } from "../runtime/block";
import retrieveValue from "../util/retrieveValue";

export default class While implements Command {
  constructor(public readonly condition: Expression) {}
  execute(env: Environment) {
    const block = new Block(
      Kind.While,
      env.address,
      (env) => retrieveValue(this.condition, env) as boolean,
      (env) => {
        block.enter(env);
        return Result.Jumpped;
      }
    );
    block.enter(env);
  }
}
