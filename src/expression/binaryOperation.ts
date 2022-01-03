import * as Factory from "../factory";
import Environment from "../runtime/environment";
import * as Expr from "./index";
import retrieveValue from "../util/retrieveValue";
import * as Kw from "../keyword";
import { OperationFailed } from "../error";
import { InternalType, RawType } from "../type";
import { default as Sym } from "../symbol";

/**
 * execute an arbitrary binary operator
 */
type Operate = (l: RawType, r: RawType, env: Environment) => InternalType;

/**
 * use a binary operator and calculate
 */
export default class BinaryOperation {
  static table: { [key: string]: Operate } = {
    [Kw.BinaryOperator.Addition]: (l, r, env) => {
      if (typeof l === "number" && typeof r === "number") {
        return Factory.createInt(l + r);
      } else if (typeof l === "string" && typeof r === "string") {
        return Factory.createStr(l + r);
      } else {
        throw new OperationFailed();
      }
    },
    [Kw.BinaryOperator.Multiplication]: (l, r, env) => {
      if (typeof r === "number") {
        if (typeof l === "number") {
          return Factory.createInt(l * r);
        } else if (typeof l === "string") {
          return Factory.createStr(l.repeat(r));
        }
      }
      throw new OperationFailed();
    },
    [Kw.BinaryOperator.Equal]: (l, r, env) => {
      return Factory.Factory(l === r);
    },
    [Kw.BinaryOperator.NotEqual]: (l, r, env) => {
      return Factory.Factory(l !== r);
    },
    [Kw.BinaryOperator.LessThan]: (l, r, env) => {
      if (typeof l === "number" && typeof r === "number") {
        return Factory.Factory(l < r);
      } else if (typeof l === "string" && typeof r === "string") {
        return Factory.Factory(l < r);
      } else {
        throw new OperationFailed();
      }
    },
    [Kw.BinaryOperator.And]: (l, r, env) => {
      const result = l && r;
      return Factory.createInternalType(result);
    },
    [Kw.BinaryOperator.Or]: (l, r, env) => {
      const result = l || r;
      return Factory.createInternalType(result);
    },
  };

  [Sym.evaluate](env: Environment): InternalType {
    const valueL = retrieveValue(this.left, env);
    const valueR = retrieveValue(this.right, env);
    return BinaryOperation.table[this.operator](valueL, valueR, env);
  }

  constructor(
    public readonly operator: string,
    public readonly left: Expr.Expression,
    public readonly right: Expr.Expression
  ) {}
}
