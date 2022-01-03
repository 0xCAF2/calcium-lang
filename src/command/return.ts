import Command from "./command";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { evaluate } from "../util";
import { None } from "../factory";

export default class Return implements Command {
  constructor(public readonly expr?: Expression) {}
  execute(env: Environment) {
    env.returnedValue = evaluate(this.expr ?? None, env);
  }
}
