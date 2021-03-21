import * as Keyword from '../keywords';
import { BasicTypes } from '../type';

export type DictLiteral = {};

export type ListLiteral = Expression[];

export interface Value {
  kind: Keyword.Type;
  value: BasicTypes | ListLiteral | DictLiteral;
}

export interface Reference {
  kind: Keyword.Reference;
}

export interface Variable extends Reference {
  name: string;
}

export type Expression = Value | Reference;
