import * as Type from "../factory";
import Environment from "../runtime/environment";
import * as Expr from "./index";
import retrieveValue from "../runtime/retrieveValue";
import { InternalType } from "../expression";
import * as Kw from "../keyword";
import { OperationFailed } from "../error";
import RawType from "./rawType";
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
        return Type.createInt(l + r);
      } else if (typeof l === "string" && typeof r === "string") {
        return Type.createStr(l + r);
      } else {
        throw new OperationFailed();
      }
    },
    [Kw.BinaryOperator.Multiplication]: (l, r, env) => {
      if (typeof r === "number") {
        if (typeof l === "number") {
          return Type.createInt(l * r);
        } else if (typeof l === "string") {
          return Type.createStr(l.repeat(r));
        }
      }
      throw new OperationFailed();
    },
    [Kw.BinaryOperator.Equal]: (l, r, env) => {
      return Type.createBool(l === r);
    },
    [Kw.BinaryOperator.NotEqual]: (l, r, env) => {
      return Type.createBool(l !== r);
    },
    [Kw.BinaryOperator.LessThan]: (l, r, env) => {
      if (typeof l === "number" && typeof r === "number") {
        return Type.createBool(l < r);
      } else if (typeof l === "string" && typeof r === "string") {
        return Type.createBool(l < r);
      } else {
        throw new OperationFailed();
      }
    },
    [Kw.BinaryOperator.And]: (l, r, env) => {
      const result = l && r;
      return Type.createInternalType(result);
    },
    [Kw.BinaryOperator.Or]: (l, r, env) => {
      const result = l || r;
      return Type.createInternalType(result);
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
