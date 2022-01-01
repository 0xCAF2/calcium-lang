import * as Type from "../factory";
import Environment from "../runtime/environment";
import * as Expr from "./index";
import retrieveValue from "../runtime/retrieveValue";
import { InternalType } from "../expression";
import * as Kw from "../keyword";
import { OperationFailed } from "../error";
import RawType from "./rawType";
import { default as Sym } from "../symbol";

type Operate = (l: RawType, r: RawType, env: Environment) => InternalType;

export default class BinaryOperation {
  static table: { [key: string]: Operate } = {
    [Kw.BinaryOperator.Addition]: (l, r, env) => {
      if (typeof l === "number" && typeof r === "number") {
        return Type.createInt(l + r);
      }
      throw new OperationFailed();
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
