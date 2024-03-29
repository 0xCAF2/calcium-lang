import { NameNotFound } from "../error";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";

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
  assign(rhs: InternalType, env: Environment) {
    env.context.register(this.name, rhs);
  }

  [Sym.evaluate](env: Environment): InternalType {
    const value = env.context.lookUp(this.name);
    if (value === undefined) {
      throw new NameNotFound(this.name);
    } else {
      return value;
    }
  }

  get [Sym.description](): string {
    return this.name;
  }
}
