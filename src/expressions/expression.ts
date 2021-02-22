import Reference from './reference';
import * as Keyword from '../keywords';

type BasicType = number | string | boolean | null;

type ContainerType = ListLiteral | DictLiteral;

type DictLiteral = {};

interface Expression {
  kind: Keyword.Expression | Keyword.Reference;
  value: BasicType | Reference | ContainerType;
}

type ListLiteral = Expression[];

export default Expression;
