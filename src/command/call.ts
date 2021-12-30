import { Command } from ".";
import Environment from "../runtime/environment";
import * as Expr from "../expression";

export default class Call implements Command {
  constructor(
    public readonly lhs: Expr.Reference | null,
    public readonly funcRef: Expr.Reference,
    public readonly args: Expr.Expression[]
  ) {}

  execute(env: Environment): void {
    console.log("Hello, World.");
  }
}
