import * as JSONElementType from "./jsonElement";
import * as Cmd from "../command";
import * as Err from "../error";
import * as Expr from "../expression";
import Index from "../indexes/index";
import * as Kw from "../keyword";
import Statement from "../runtime/statement";
import {
  createBool,
  createDict,
  createInt,
  createList,
  createStr,
  None,
} from "../factory";
import { InternalType } from "../type";

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
    this.table.set(Kw.Command.Assign, (stmt) => {
      const lhs = this.readReference(
        stmt[Index.Assign.Lhs] as JSONElementType.Reference
      );
      const rhs = this.readExpression(stmt[Index.Assign.Rhs]);
      return new Cmd.Assign(lhs, rhs);
    });

    this.table.set(Kw.Command.Break, (stmt) => {
      return new Cmd.Break();
    });

    this.table.set(Kw.Command.Class, (stmt) => {
      const className = stmt[Index.Class.Name] as string;
      const superclassName = stmt[Index.Class.SuperclassName] as string | null;
      if (superclassName === null) {
        return new Cmd.Class(className);
      } else {
        return new Cmd.Class(className, superclassName);
      }
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
      const lhs = this.readReference(
        stmt[Index.Assign.Lhs] as JSONElementType.Reference
      );
      const rhs = this.readExpression(stmt[Index.Assign.Rhs]);
      return new Cmd.CompoundAssign(Kw.BinaryOperator.Addition, lhs, rhs);
    });

    this.table.set(Kw.Command.CompoundMultiplication, (stmt) => {
      const lhs = this.readReference(
        stmt[Index.Assign.Lhs] as JSONElementType.Reference
      );
      const rhs = this.readExpression(stmt[Index.Assign.Rhs]);
      return new Cmd.CompoundAssign(Kw.BinaryOperator.Multiplication, lhs, rhs);
    });

    this.table.set(Kw.Command.Def, (stmt) => {
      const name = stmt[Index.FuncDef.Name] as string;
      const params = stmt[Index.FuncDef.Parameters] as string[];
      return new Cmd.Def(name, params);
    });

    this.table.set(Kw.Command.Elif, (stmt) => {
      const condition = this.readExpression(stmt[Index.Conditional.Expr]);
      return new Cmd.Elif(condition);
    });

    this.table.set(Kw.Command.Else, (stmt) => {
      return new Cmd.Else();
    });

    // the end of program
    this.table.set(Kw.Command.End, (stmt) => {
      return new Cmd.End();
    });

    this.table.set(Kw.Command.Expression, (stmt) => {
      const expr = this.readExpression(stmt[Index.Expression.value]);
      return new Cmd.Expression(expr);
    });

    this.table.set(Kw.Command.For, (stmt) => {
      const variable = this.readReference(
        stmt[Index.For.Variable] as JSONElementType.Reference
      );
      const iterable = this.readExpression(stmt[Index.For.Iterable]);
      return new Cmd.For(variable, iterable);
    });

    this.table.set(Kw.Command.If, (stmt) => {
      const condition = this.readExpression(stmt[Index.Conditional.Expr]);
      return new Cmd.If(condition);
    });

    this.table.set(Kw.Command.Ifs, (stmt) => {
      return new Cmd.Ifs();
    });

    this.table.set(Kw.Command.Pass, (stmt) => {
      return new Cmd.Pass();
    });

    this.table.set(Kw.Command.Return, (stmt) => {
      if (stmt.length > Index.Return.Expr) {
        const expr = this.readExpression(stmt[Index.Return.Expr]);
        return new Cmd.Return(expr);
      } else {
        return new Cmd.Return();
      }
    });

    this.table.set(Kw.Command.While, (stmt) => {
      const condition = this.readExpression(stmt[Index.Conditional.Expr]);
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
      const arg = this.readExpression(a);
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

  readBinaryOperation(
    operator: string,
    expr: JSONElementType.BinaryOperation
  ): Expr.BinaryOperation {
    if (!Kw.BinaryOperatorsSet.has(operator)) {
      throw new Err.CannotConvertToExpression();
    }
    const left = this.readExpression(expr[Index.BinaryOperator.Left]);
    const right = this.readExpression(expr[Index.BinaryOperator.Right]);
    return new Expr.BinaryOperation(operator, left, right);
  }

  /**
   * parse JSON element(s) and return `Expression`.
   * @param expr any JSON element
   * @returns an internal type or a reference
   */
  readExpression(expr: JSONElementType.Any): Expr.Expression {
    if (Array.isArray(expr)) {
      if (Array.isArray(expr[0])) {
        // expr is an array literal.
        const list: Expr.Expression[] = [];
        for (let elem of expr[0]) {
          list.push(this.readExpression(elem));
        }
        return createList(list) as InternalType;
      } else if (
        expr[0] === Kw.Reference.Attribute ||
        expr[0] === Kw.Reference.Comma ||
        expr[0] === Kw.Reference.Subscript ||
        expr[0] === Kw.Reference.Variable
      ) {
        // expr is a reference.
        return this.readReference(expr);
      } else if (expr[0] === Kw.Reference.Call) {
        const func = this.readReference(
          expr[Index.Call.FuncRef] as JSONElementType.Reference
        );
        const args = this.extractArgs(
          expr[Index.Call.Args] as JSONElementType.Any[]
        );
        return new Expr.Call(func, args);
      } else if (
        expr[0] === Kw.UnaryOperator.BitwiseNot ||
        expr[0] === Kw.UnaryOperator.Negative ||
        expr[0] === Kw.UnaryOperator.Not
      ) {
        return this.readUnaryOperation(expr[0], expr);
      } else if (expr.length === 3) {
        // expr could be a binary operation
        return this.readBinaryOperation(expr[0], expr);
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
    } else if (typeof expr === "object") {
      // can generate an empty dict only
      return createDict({});
    } else {
      throw new Err.CannotConvertToExpression();
    }
  }

  /**
   * parse a reference array and return an reference object used in runtime.
   * @param expr a reference array such as `["var", "x"]`
   * @returns a reference object to be evaluated later
   */
  readReference(expr: JSONElementType.Reference): Expr.Reference {
    const kw = expr[Index.Expression.Keyword];
    if (kw === Kw.Reference.Variable) {
      return new Expr.Variable(expr[Index.Variable.Name] as string);
    } else if (kw === Kw.Reference.Attribute) {
      const attrsName: string[] = [];
      for (let i = Index.Attribute.firstAttributeName; i < expr.length; ++i) {
        attrsName.push(expr[i] as string);
      }
      return new Expr.Attribute(
        expr[Index.Attribute.varName] as string,
        attrsName
      );
    } else if (kw === Kw.Reference.Subscript) {
      if (expr.length === 3) {
        const ref = this.readReference(
          expr[Index.Subscript.ReferredObj] as JSONElementType.Reference
        );
        const index = this.readExpression(expr[Index.Subscript.IndexExpr]);
        return new Expr.Subscript(ref, index);
      } else if (expr.length >= 4) {
        // slice
        const ref = this.readReference(
          expr[Index.Subscript.ReferredObj] as JSONElementType.Reference
        );
        const lower = this.readExpression(
          expr[Index.Subscript.SliceStart] as JSONElementType.Any
        );
        const upper = this.readExpression(
          expr[Index.Subscript.SliceEnd] as JSONElementType.Any
        );
        return new Expr.Subscript(ref, lower, upper);
      }
      throw new Err.FewerElement();
    } else if (kw === Kw.Reference.Comma) {
      const refs: Expr.Reference[] = [];
      for (let i = 1; i < expr.length; ++i) {
        refs.push(this.readReference(expr[i] as JSONElementType.Reference));
      }
      return new Expr.Comma(refs);
    } else {
      throw new Err.UnsupportedKeyword(kw as string);
    }
  }

  readUnaryOperation(
    operator: string,
    expr: JSONElementType.UnaryOperation
  ): Expr.UnaryOperation {
    return new Expr.UnaryOperation(operator, None); // TODO change here
  }
}
