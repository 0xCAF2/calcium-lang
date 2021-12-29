import Command, { Comment } from "../command";
import { CommandNotFound } from "../error";
import Index from "../index/index";
import Keyword from "../keyword";
import Statement from "../runtime/statement";

export default class Parser {
  constructor(
    public readonly table = new Map<
      Keyword.Command,
      (stmt: Statement) => Command
    >()
  ) {
    this.table.set(Keyword.Command.Comment, (stmt) => {
      const text = stmt[Index.Comment.Text];
      if (typeof text === "string") {
        return new Comment(text);
      } else {
        return new Comment(null);
      }
    });
  }
  read(stmt: Statement): Command {
    const kw = stmt[Index.Statement.Keyword];
    const cmd = this.table.get(kw)?.(stmt);
    if (cmd === undefined) {
      throw new CommandNotFound();
    } else {
      return cmd;
    }
  }
}
