import Environment from "../runtime/environment";
import * as Err from "../error";
import * as Type from "../type";

export default class Variable {
  constructor(public readonly name: string) {}

  assign(rhs: Type.Any, env: Environment) {
    env.context.register(this.name, rhs);
  }

  evaluate(env: Environment): Type.Any {
    const value = env.context.lookUp(this.name);
    if (value === undefined) {
      throw new Err.NameNotFound(this.name);
    } else {
      return value;
    }
  }
}
