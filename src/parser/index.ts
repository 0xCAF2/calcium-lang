import * as JSONElementType from "./jsonElement";
import * as Cmd from "../command";
import * as Err from "../error";
import * as Expr from "../expression";
import Index from "../index/index";
import { default as Kw } from "../keyword";
import Statement from "../runtime/statement";

export default class Parser {
  constructor(
    public readonly table = new Map<
      Kw.Command,
      (stmt: Statement) => Cmd.Command
    >()
  ) {
    this.table.set(Kw.Command.Call, (stmt) => {
      const lhs = this.convert(stmt[Index.Call.Lhs]) as Expr.Reference;
      const funcRef = this.convert(stmt[Index.Call.FuncRef]) as Expr.Reference;
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
  }

  convert(expr: JSONElementType.Any): Expr.Expression {
    if (Array.isArray(expr)) {
      const kw = expr[Index.Expression.Keyword];
      if (kw === Kw.Reference.Variable) {
        return new Expr.Variable(expr[Index.Variable.Name] as string);
      } else {
        return {};
      }
    } else if (typeof expr === "string") {
      return expr; // TODO: change to Str
    }
    return {};
  }

  extractArgs(args: JSONElementType.Any[]): Expr.Expression[] {
    return [];
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
