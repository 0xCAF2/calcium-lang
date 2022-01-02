import * as JSONElementType from "./jsonElement";
import * as Cmd from "../command";
import * as Err from "../error";
import * as Expr from "../expression";
import Index from "../indexes/index";
import * as Kw from "../keyword";
import Statement from "../runtime/statement";
import { createBool, createInt, createList, createStr, None } from "../factory";

/**
 * a default parser for Calcium language
 */
export default class Parser {
  /**
   *
   * @param table has default implementation when it is undefined.
   */
  constructor(
    public readonly table = new Map<
      Kw.Command,
      (stmt: Statement) => Cmd.Command
    >()
  ) {
    // an assignment
    this.table.set(Kw.Command.Assignment, (stmt) => {
      const lhs = this.translateReference(
        stmt[Index.Assignment.Lhs] as JSONElementType.Reference
      );
      const rhs = this.translateExpression(stmt[Index.Assignment.Rhs]);
      return new Cmd.Assignment(lhs, rhs);
    });

    // a function call
    this.table.set(Kw.Command.Call, (stmt) => {
      const lhsElem = stmt[Index.Call.Lhs];
      const lhs =
        lhsElem === null
          ? None
          : this.translateReference(lhsElem as JSONElementType.Reference);
      const funcRef = this.translateReference(
        stmt[Index.Call.FuncRef] as JSONElementType.Reference
      );
      const args = this.extractArgs(
        stmt[Index.Call.Args] as JSONElementType.Any[]
      );
      return new Cmd.Call(lhs, funcRef, args);
    });

    // a comment line
    this.table.set(Kw.Command.Comment, (stmt) => {
      const text = stmt[Index.Comment.Text];
      if (typeof text === "string") {
        return new Cmd.Comment(text);
      } else {
        return new Cmd.Comment(null);
      }
    });

    // compound assignment
    this.table.set(Kw.Command.CompoundAddition, (stmt) => {
      const lhs = this.translateReference(
        stmt[Index.Assignment.Lhs] as JSONElementType.Reference
      );
      const rhs = this.translateExpression(stmt[Index.Assignment.Rhs]);
      return new Cmd.CompoundAssignment(Kw.BinaryOperator.Addition, lhs, rhs);
    });

    this.table.set(Kw.Command.CompoundMultiplication, (stmt) => {
      const lhs = this.translateReference(
        stmt[Index.Assignment.Lhs] as JSONElementType.Reference
      );
      const rhs = this.translateExpression(stmt[Index.Assignment.Rhs]);
      return new Cmd.CompoundAssignment(
        Kw.BinaryOperator.Multiplication,
        lhs,
        rhs
      );
    });

    this.table.set(Kw.Command.Elif, (stmt) => {
      const condition = this.translateExpression(stmt[Index.Conditional.expr]);
      return new Cmd.Elif(condition);
    });

    this.table.set(Kw.Command.Else, (stmt) => {
      return new Cmd.Else();
    });

    // the end of program
    this.table.set(Kw.Command.End, (stmt) => {
      return new Cmd.End();
    });

    this.table.set(Kw.Command.ForRange, (stmt) => {
      const varName = stmt[Index.ForRange.VariableName] as string;
      const rangeValues = stmt[Index.ForRange.Values] as JSONElementType.Any[];
      let start = null,
        stop: Expr.Expression,
        step = null;
      if (rangeValues.length === 1) {
        stop = this.translateExpression(rangeValues[0]);
      } else if (rangeValues.length === 2) {
        start = this.translateExpression(rangeValues[0]);
        stop = this.translateExpression(rangeValues[1]);
      } else if (rangeValues.length === 3) {
        start = this.translateExpression(rangeValues[0]);
        stop = this.translateExpression(rangeValues[1]);
        step = this.translateExpression(rangeValues[2]);
      } else {
        throw new Err.InvalidRange();
      }
      return new Cmd.ForRange(varName, start, stop, step);
    }),
      this.table.set(Kw.Command.If, (stmt) => {
        const condition = this.translateExpression(
          stmt[Index.Conditional.expr]
        );
        return new Cmd.If(condition);
      });

    this.table.set(Kw.Command.Ifs, (stmt) => {
      return new Cmd.Ifs();
    });

    this.table.set(Kw.Command.While, (stmt) => {
      const condition = this.translateExpression(stmt[Index.Conditional.expr]);
      return new Cmd.While(condition);
    });
  }

  /**
   * used by `Call`.
   * @param args arguments given to a function
   * @returns converted objects that will be evaluated in runtime
   */
  extractArgs(args: JSONElementType.Any[]): Expr.Expression[] {
    const convertedArgs: Expr.Expression[] = [];
    for (let a of args) {
      const arg = this.translateExpression(a);
      convertedArgs.push(arg);
    }
    return convertedArgs;
  }

  /**
   *
   * @param stmt a JSON array that represents one line to execute
   * @returns a command object to be executed
   */
  read(stmt: Statement): Cmd.Command {
    const kw = stmt[Index.Statement.Keyword];
    const cmd = this.table.get(kw)?.(stmt);
    if (cmd === undefined) {
      throw new Err.CommandNotFound();
    } else {
      return cmd;
    }
  }

  translateBinaryOperation(
    operator: string,
    expr: JSONElementType.BinaryOperation
  ): Expr.BinaryOperation {
    if (!Kw.BinaryOperatorsSet.has(operator)) {
      throw new Err.CannotConvertToExpression();
    }
    const left = this.translateExpression(expr[Index.BinaryOperator.Left]);
    const right = this.translateExpression(expr[Index.BinaryOperator.Right]);
    return new Expr.BinaryOperation(operator, left, right);
  }

  /**
   * parse JSON element(s) and return `Expression`.
   * @param expr any JSON element
   * @returns an internal type or a reference
   */
  translateExpression(expr: JSONElementType.Any): Expr.Expression {
    if (Array.isArray(expr)) {
      if (Array.isArray(expr[0])) {
        // expr is an array literal.
        const list: Expr.Expression[] = [];
        for (let elem of expr[0]) {
          list.push(this.translateExpression(elem));
        }
        return createList(list) as Expr.InternalType;
      } else if (
        expr[0] === Kw.Reference.Variable ||
        expr[0] === Kw.Reference.Attribute ||
        expr[0] === Kw.Reference.Subscript
      ) {
        // expr is a reference.
        return this.translateReference(expr);
      } else if (
        expr[0] === Kw.UnaryOperator.BitwiseNot ||
        expr[0] === Kw.UnaryOperator.Negative ||
        expr[0] === Kw.UnaryOperator.Not
      ) {
        return this.translateUnaryOperation(expr[0], expr);
      } else if (expr.length === 3) {
        // expr could be a binary operation
        return this.translateBinaryOperation(expr[0], expr);
      } else {
        throw new Err.CannotConvertToExpression();
      }
    } else if (typeof expr === "number") {
      return createInt(expr);
    } else if (typeof expr === "string") {
      return createStr(expr);
    } else if (typeof expr === "boolean") {
      return createBool(expr);
    } else if (expr === null) {
      return None;
    } else {
      throw new Err.CannotConvertToExpression();
    }
  }

  /**
   * parse a reference array and return an reference object used in runtime.
   * @param expr a reference array such as `["var", "x"]`
   * @returns a reference object to be evaluated later
   */
  translateReference(expr: JSONElementType.Reference): Expr.Reference {
    const kw = expr[Index.Expression.Keyword];
    if (kw === Kw.Reference.Variable) {
      return new Expr.Variable(expr[Index.Variable.Name] as string);
    } else {
      throw new Err.UnsupportedKeyword(kw as string);
    }
  }

  translateUnaryOperation(
    operator: string,
    expr: JSONElementType.UnaryOperation
  ): Expr.UnaryOperation {
    return new Expr.UnaryOperation(operator, None); // TODO change here
  }
}
