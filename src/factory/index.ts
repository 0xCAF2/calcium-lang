import * as Expr from "../expression";
import None from "./none";

export { None };

export type Any = typeof Proxy | Expr.Reference;
