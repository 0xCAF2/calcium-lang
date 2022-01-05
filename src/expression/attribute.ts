import { AttributeNotFound, NameNotFound } from "../error";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";
import { evaluate } from "../util";

export default class Attribute {
  constructor(
    public readonly varName: string,
    public readonly attrNames: string[]
  ) {}

  assign(rhs: InternalType, env: Environment) {
    let target = env.context.lookUp(this.varName);
    if (target === undefined) {
      throw new NameNotFound(this.varName);
    } else {
      for (let i = 0; i < this.attrNames.length - 1; ++i) {
        target = Reflect.get(target, this.attrNames[i]);
        if (target === undefined) {
          throw new AttributeNotFound(this.attrNames[i]);
        }
      }
      const value = evaluate(rhs, env);
      Reflect.set(target, this.attrNames[this.attrNames.length - 1], value);
    }
  }

  [Sym.evaluate](env: Environment): InternalType {
    let target = env.context.lookUp(this.varName);
    if (target === undefined) {
      throw new NameNotFound(this.varName);
    } else {
      for (let attrName of this.attrNames) {
        target = Reflect.get(target, attrName);
        if (target === undefined) {
          throw new AttributeNotFound(attrName);
        }
      }
      return target;
    }
  }

  get [Sym.description](): string {
    return `${this.varName}.${this.attrNames.join(".")}`;
  }
}
