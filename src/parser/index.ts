import * as JSONElementType from "./jsonElement";
import * as Cmd from "../command";
import createList from "../factory/list";
import createStr from "../factory/str";
import * as Err from "../error";
import * as Expr from "../expression";
import Index from "../index/index";
import * as Kw from "../keyword";
import Statement from "../runtime/statement";
import { None } from "../factory";

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
      const lhs = this.convertToReference(
        stmt[Index.Assignment.Lhs] as JSONElementType.Reference
      );
      const rhs = this.convertToExpression(stmt[Index.Assignment.Rhs]);
      return new Cmd.Assignment(lhs, rhs);
    });

    // a function call
    this.table.set(Kw.Command.Call, (stmt) => {
      const lhs = this.convertToExpression(stmt[Index.Call.Lhs]);
      const funcRef = this.convertToReference(
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

    // the end of program
    this.table.set(Kw.Command.End, (stmt) => {
      return new Cmd.End();
    });
  }

  /**
   * parse JSON element(s) and return `Expression`.
   * @param expr any JSON element
   * @returns an internal type or a reference
   */
  convertToExpression(expr: JSONElementType.Any): Expr.Expression {
    if (Array.isArray(expr)) {
      if (Array.isArray(expr[0])) {
        // expr is an array literal.
        const list: Expr.Expression[] = [];
        for (let elem of expr[0]) {
          list.push(this.convertToExpression(elem));
        }
        return createList(list) as Expr.InternalType;
      } else {
        // expr is a reference.
        return this.convertToReference(expr as JSONElementType.Reference);
      }
    } else if (typeof expr === "string") {
      return createStr(expr) as Expr.InternalType;
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
  convertToReference(expr: JSONElementType.Reference): Expr.Reference {
    const kw = expr[Index.Expression.Keyword];
    if (kw === Kw.Reference.Variable) {
      return new Expr.Variable(expr[Index.Variable.Name] as string);
    } else {
      throw new Err.UnsupportedKeyword(kw as string);
    }
  }

  /**
   * used by `Call`.
   * @param args arguments given to a function
   * @returns converted objects that will be evaluated in runtime
   */
  extractArgs(args: JSONElementType.Any[]): Expr.Expression[] {
    const convertedArgs: Expr.Expression[] = [];
    for (let a of args) {
      const arg = this.convertToExpression(a);
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
}
