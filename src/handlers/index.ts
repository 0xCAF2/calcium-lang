import Command from '../commands/command';
import Environment from '../environment';
import { NameNotFound } from '../errors';
import { Expression, ListLiteral, DictLiteral } from '../expressions';
import Variable from '../expressions/variable';
import * as Keyword from '../keywords';
import Type from '../type';

export * from './assignment';

export type Handler = (cmd: Command, env: Environment) => void;

export function evaluate(value: Expression, env: Environment): Type {
  if (typeof value === 'number'
  || typeof value === 'string'
  || typeof value === 'boolean'
  || value === null) {
    return value;
  } else if (value instanceof Array) {
    const list: Type[] = [];
    for (let elem of value.content as ListLiteral) {
      list.push(evaluate(elem, env));
    }
    return list;
  }
  switch (value.kind) {
    case Keyword.Reference.Variable:
      const variable = value.content as Variable;
      const evaluatedValue = env.context.lookUp(variable.name);
      if (evaluatedValue === undefined) {
        throw new NameNotFound();
      } else {
        return evaluatedValue;
      }
    default:
      return {}; // An empty dict is allowed only.
  }
}
