import Reference from './reference';
import * as Keyword from '../keywords';

type BasicType = number | string | boolean | null;

type ContainerType = ListLiteral | DictLiteral;

type DictLiteral = {};

type ListLiteral = Expression[];

interface Expression {
  kind: Keyword.Expression | Keyword.Reference;
  value: BasicType | ContainerType | Reference;
}

export default Expression;
