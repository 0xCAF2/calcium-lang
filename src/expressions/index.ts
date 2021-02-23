import Reference from './reference';
import * as Keyword from '../keywords';
import { BasicType } from '../type';

type DictLiteral = {};

type ListLiteral = Expression[];

interface Expression {
  kind: Keyword.Expression | Keyword.Reference;
  content: BasicType | ListLiteral | DictLiteral | Reference;
}

export default Expression;
