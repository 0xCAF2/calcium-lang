import * as Keyword from '../keywords';
import { BasicTypes } from '../type';

export type DictLiteral = {};

export type ListLiteral = Expression[];

export interface Reference {
  kind: Keyword.Reference;
}

export interface Variable extends Reference {
  name: string;
}

export interface Subscript extends Reference {
  container: Reference;
  indexOrKey: number | string;
}

export type Expression = BasicTypes | Reference;
