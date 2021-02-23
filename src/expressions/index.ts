import Reference from './reference';
import * as Keyword from '../keywords';
import { BasicType } from '../type';

export type DictLiteral = {};

export type ListLiteral = Expression[];

export interface Expression {
  kind: Keyword.Expression | Keyword.Reference;
  content: BasicType | ListLiteral | DictLiteral | Reference;
}
