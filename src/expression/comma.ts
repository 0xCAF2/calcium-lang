import { Reference } from ".";
import { CannotUnpackValue } from "../error";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";
import { retrieveValue } from "../util";

/**
 * multiple values assignment or unpacking
 */
export default class Comma {
  constructor(public readonly refs: Reference[]) {}

  assign(rhs: InternalType, env: Environment) {
    const kind = Reflect.get(rhs, Sym.class);
    if (kind !== "list" && kind !== "tuple") {
      throw new CannotUnpackValue();
    }
    const container = retrieveValue(rhs, env) as InternalType[];

    for (let i = 0; i < this.refs.length; ++i) {
      this.refs[i].assign(container[i], env);
    }
  }

  get [Sym.description](): string {
    return `${this.refs
      .map((r) => Reflect.get(r, Sym.description))
      .join(", ")}`;
  }
}
