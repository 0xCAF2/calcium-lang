import { InternalType } from "../expression";
import { None, NoneType } from "./none";

export type Any = InternalType | NoneType;

export { None, NoneType };
