import { Expression, Reference } from ".";
import { None } from "../factory";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";
import { evaluate } from "../util";

/**
 * access the element by an index or a key
 */
export default class Subscript {
  /**
   *
   * @param referredObj
   * @param lower could be a single index or key. Otherwise the value from which
   * a slice starts.
   * @param upper the value at which a slice ends, if any
   */
  constructor(
    public readonly referredObj: Reference,
    public readonly lower: Expression,
    public readonly upper?: Expression
  ) {}

  assign(rhs: InternalType, env: Environment) {
    const ref = evaluate(this.referredObj, env);
    const rhsValue = evaluate(rhs, env);
    if (this.upper === undefined) {
      const index = evaluate(this.lower, env);
      Reflect.get(ref, Sym.subscript)(index, rhsValue);
    } else {
      const l = evaluate(this.lower, env);
      const u = evaluate(this.upper, env);
      Reflect.get(ref, Sym.slice)(l, u, rhsValue);
    }
  }

  [Sym.evaluate](env: Environment): InternalType {
    const ref = evaluate(this.referredObj, env);
    if (this.upper === undefined) {
      const index = evaluate(this.lower, env);
      return Reflect.get(ref, Sym.subscript)(index);
    } else {
      const l = evaluate(this.lower, env);
      const u = evaluate(this.upper, env);
      // slice requires to be evaluated to create new list object
      return evaluate(Reflect.get(ref, Sym.slice)(l, u), env);
    }
  }

  get [Sym.description](): string {
    if (this.upper === undefined) {
      return `${Reflect.get(this.referredObj, Sym.description)}[${Reflect.get(
        this.lower,
        Sym.description
      )}]`;
    } else {
      // consider the cases such as `a[:-1]` or `a[:]`.
      const lowerStr =
        this.lower === None ? "" : Reflect.get(this.lower, Sym.description);
      const upperStr =
        this.upper === None ? "" : Reflect.get(this.upper, Sym.description);
      return `${Reflect.get(
        this.referredObj,
        Sym.description
      )}[${lowerStr}:${upperStr}]`;
    }
  }
}
