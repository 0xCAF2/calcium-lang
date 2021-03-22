import Command from '../commands/command';
import Environment from '../environment';
import { NameNotFound } from '../errors';
import { Expression, ListLiteral, Subscript, Variable } from '../expressions';
import * as Keyword from '../keywords';
import { SomeType } from '../type';

export * from './assignment';

export type Handler = (cmd: Command, env: Environment) => void;

export function evaluate(expr: Expression, env: Environment): SomeType {
  if (typeof expr === 'number'
  || typeof expr === 'string'
  || typeof expr === 'boolean'
  || expr === null) {
    return expr;
  } else if (expr instanceof Array) {
    const list: SomeType[] = [];
    for (let elem of expr as ListLiteral) {
      list.push(evaluate(elem, env));
    }
    return list;
  } else {
    const kind = expr.kind;
    switch (expr.kind) {
      case Keyword.Reference.Variable:
        const variable = expr as Variable;
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
}
