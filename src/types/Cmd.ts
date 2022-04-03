import type { Expr } from "./Expr";

export interface End {
  cmd: "end";
  indent: number;
}

export interface ExprStmt {
  cmd: "expr";
  indent: number;
  expr: Expr;
}

export type Cmd = End | ExprStmt;
