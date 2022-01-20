import Environment from "../runtime/environment";
import * as Expr from "./index";
import retrieveValue from "../util/retrieveValue";
import * as Kw from "../keyword";
import { OperationFailed } from "../error";
import { InternalType, RawType } from "../type";
import { default as Sym } from "../symbol";
import {
  createBool,
  createInt,
  createInternalType,
  createList,
  createStr,
} from "../factory";

/**
 * execute an arbitrary binary operator
 */
type Operate = (l: RawType, r: RawType) => InternalType;

/**
 * use a binary operator and calculate
 */
export default class BinaryOperation {
  static table: { [key: string]: Operate } = {
    [Kw.BinaryOperator.Addition]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createInt(l + r);
      } else if (typeof l === "string" && typeof r === "string") {
        return createStr(l + r);
      } else if (Array.isArray(l) && Array.isArray(r)) {
        return createList(l.concat(r));
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.Subtraction]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createInt(l - r);
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.Multiplication]: (l, r) => {
      if (typeof r === "number") {
        if (typeof l === "number") {
          return createInt(l * r);
        } else if (typeof l === "string") {
          return createStr(l.repeat(r));
        }
      }
      throw new OperationFailed();
    },

    [Kw.BinaryOperator.FloorDivision]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createInt(Math.floor(l / r));
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.Remainder]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createInt(l % r);
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.Exponentiation]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createInt(l ** r);
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.Equal]: (l, r) => {
      return createBool(l === r);
    },

    [Kw.BinaryOperator.NotEqual]: (l, r) => {
      return createBool(l !== r);
    },

    [Kw.BinaryOperator.GreaterThan]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createBool(l > r);
      } else if (typeof l === "string" && typeof r === "string") {
        return createBool(l > r);
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.LessThan]: (l, r) => {
      if (typeof l === "number" && typeof r === "number") {
        return createBool(l < r);
      } else if (typeof l === "string" && typeof r === "string") {
        return createBool(l < r);
      } else {
        throw new OperationFailed();
      }
    },

    [Kw.BinaryOperator.And]: (l, r) => {
      const result = l && r;
      return createInternalType(result);
    },

    [Kw.BinaryOperator.Or]: (l, r) => {
      const result = l || r;
      return createInternalType(result);
    },
  };

  constructor(
    public readonly operator: string,
    public readonly left: Expr.Expression,
    public readonly right: Expr.Expression
  ) {}

  [Sym.evaluate](env: Environment): InternalType {
    const valueL = retrieveValue(this.left, env);
    const valueR = retrieveValue(this.right, env);
    return BinaryOperation.table[this.operator](valueL, valueR);
  }
}
