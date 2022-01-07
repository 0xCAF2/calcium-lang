import { InternalType, RawType } from "../type";
import { Expression } from "./index";
import * as Kw from "../keyword";
import Environment from "../runtime/environment";
import { retrieveValue } from "../util";
import createBool from "../factory/bool";
import { default as Sym } from "../symbol";

/**
 * use a unary operator and calculate
 */
export default class UnaryOperation {
  static table: {
    [key: string]: (operand: RawType) => InternalType;
  } = {
    [Kw.UnaryOperator.Not]: (operand) => {
      return createBool(!operand);
    },
  };
  constructor(
    public readonly operator: string,
    public readonly operand: Expression
  ) {}

  [Sym.evaluate](env: Environment): InternalType {
    const value = retrieveValue(this.operand, env);
    return UnaryOperation.table[this.operator](value);
  }
}
