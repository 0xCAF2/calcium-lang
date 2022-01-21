import Command from "./command";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { evaluate } from "../util";
import { None } from "../factory";
import { Kind } from "../runtime/block";

/**
 * return an expression, if any (default `None`)
 */
export default class Return implements Command {
  constructor(public readonly expr?: Expression) {}
  execute(env: Environment) {
    env.returnedValue = evaluate(this.expr ?? None, env);
    while (true) {
      const block = env.lastBlock;
      switch (block.kind) {
        case Kind.Call:
          block.exit(env);
          return;
        default:
          env.blocks.pop();
          continue;
      }
    }
  }
}
