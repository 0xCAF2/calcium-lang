import Environment from "../runtime/environment";
import * as Err from "../error";
import * as Type from "../factory";

/**
 * a simple reference to a value
 * `Variable` don't refer to any attribute or use subscript.
 */
export default class Variable {
  constructor(public readonly name: string) {}

  /**
   * eg. `x = 7`
   * @param rhs a right hand side value
   * @param env
   */
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

  get description(): string {
    return this.name;
  }
}
