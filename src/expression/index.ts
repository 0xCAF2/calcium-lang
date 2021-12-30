import { None } from "../type";
import Variable from "./variable";

export type Reference = Variable;

export type Literal = {};

export type Expression = Literal | Reference | typeof None;

export { Variable };
