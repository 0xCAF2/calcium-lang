import Command from "./command";
import Environment from "../runtime/environment";
import * as Expr from "../expression";
import { Block, Kind, Result } from "../runtime/block";
import retrieveValue from "../runtime/retrieveValue";

export default class While implements Command {
  constructor(public readonly condition: Expr.Expression) {}
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
