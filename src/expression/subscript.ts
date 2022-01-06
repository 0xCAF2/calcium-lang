import { Expression, Reference } from ".";
import { AttributeNotFound, NameNotFound } from "../error";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";
import { evaluate, retrieveValue } from "../util";

export default class Subscript {
  constructor(
    public readonly referredObj: Reference,
    public readonly lower: Expression,
    public readonly upper?: Expression
  ) {}

  assign(rhs: InternalType, env: Environment) {
    throw new Error("Not implemented.");
  }

  [Sym.evaluate](env: Environment): InternalType {
    const ref = evaluate(this.referredObj, env);
    const index = evaluate(this.lower, env);
    return Reflect.get(ref, Sym.subscript)(index);
  }

  get [Sym.description](): string {
    if (this.upper === undefined) {
      return `${Reflect.get(this.referredObj, Sym.description)}[${Reflect.get(
        this.lower,
        Sym.description
      )}]`;
    } else {
      throw new Error("Not implemented.");
    }
  }
}
