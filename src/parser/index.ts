import * as JSONElementType from "./jsonElement";
import * as Cmd from "../command";
import * as Err from "../error";
import * as Expr from "../expression";
import Index from "../index/index";
import { default as Kw } from "../keyword";
import Statement from "../runtime/statement";
import * as Type from "../type";

export default class Parser {
  constructor(
    public readonly table = new Map<
      Kw.Command,
      (stmt: Statement) => Cmd.Command
    >()
  ) {
    this.table.set(Kw.Command.Call, (stmt) => {
      const lhs = this.convertToExpression(
        stmt[Index.Call.Lhs]
      ) as Expr.Reference;
      const funcRef = this.convertToExpression(
        stmt[Index.Call.FuncRef]
      ) as Expr.Reference;
      const args = this.extractArgs(
        stmt[Index.Call.Args] as JSONElementType.Any[]
      );
      return new Cmd.Call(lhs, funcRef, args);
    });

    this.table.set(Kw.Command.Comment, (stmt) => {
      const text = stmt[Index.Comment.Text];
      if (typeof text === "string") {
        return new Cmd.Comment(text);
      } else {
        return new Cmd.Comment(null);
      }
    });

    this.table.set(Kw.Command.End, (stmt) => {
      return new Cmd.End();
    });
  }

  convertToExpression(expr: JSONElementType.Any): Expr.Expression {
    if (Array.isArray(expr)) {
      if (Array.isArray(expr[0])) {
        // expr is an array literal.
        const list: Expr.Expression[] = [];
        for (let elem of expr[0]) {
          list.push(this.convertToExpression(elem));
        }
        return list; // TODO: change to List
      } else {
        return this.convertToReference(expr as JSONElementType.Reference);
      }
    } else if (typeof expr === "string") {
      return new Type.Str(expr);
    } else if (expr === null) {
      return Type.None;
    } else {
      throw new Err.CannotConvertToExpression();
    }
  }

  convertToReference(expr: JSONElementType.Reference): Expr.Reference {
    const kw = expr[Index.Expression.Keyword];
    if (kw === Kw.Reference.Variable) {
      return new Expr.Variable(expr[Index.Variable.Name] as string);
    } else {
      throw new Err.UnsupportedKeyword(kw as string);
    }
  }

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
