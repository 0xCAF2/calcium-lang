import { AttributeNotFound, NameNotFound } from "../error";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { InternalType } from "../type";
import { evaluate } from "../util";

/**
 * access to the attribute of an objecct
 */
export default class Attribute {
  /**
   *
   * @param varName the identifier of the first referred object
   * @param attrsName each attribute's name
   */
  constructor(
    public readonly varName: string,
    public readonly attrsName: string[]
  ) {}

  assign(rhs: InternalType, env: Environment) {
    let target = env.context.lookUp(this.varName);
    if (target === undefined) {
      throw new NameNotFound(this.varName);
    } else {
      // repeat to the element before the last one that is the name of
      // the attribute to be created or updated
      for (let i = 0; i < this.attrsName.length - 1; ++i) {
        target = Reflect.get(target, this.attrsName[i]);
        if (target === undefined) {
          throw new AttributeNotFound(this.attrsName[i]);
        }
      }
      const value = evaluate(rhs, env);
      Reflect.set(target, this.attrsName[this.attrsName.length - 1], value);
    }
  }

  [Sym.evaluate](env: Environment): InternalType {
    let target = env.context.lookUp(this.varName);
    if (target === undefined) {
      throw new NameNotFound(this.varName);
    } else {
      for (let attrName of this.attrsName) {
        target = Reflect.get(target, attrName);
        if (target === undefined) {
          throw new AttributeNotFound(attrName);
        }
      }
      return target;
    }
  }

  get [Sym.description](): string {
    return `${this.varName}.${this.attrsName.join(".")}`;
  }
}
