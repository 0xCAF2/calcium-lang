import Command from '../commands/command';
import Environment from '../environment';
import { NameNotFound } from '../errors';
import { Expression, ListLiteral, Variable } from '../expressions';
import * as Keyword from '../keywords';
import { AllTypes } from '../type';

export * from './assignment';

export type Handler = (cmd: Command, env: Environment) => void;

export function evaluate(expr: Expression, env: Environment): AllTypes {
  const kind = expr.kind;
  switch (expr.kind) {
    case Keyword.Type.Int:
    case Keyword.Type.Str:
    case Keyword.Type.Bool:
    case Keyword.Type.None:
      return expr.value;
    case Keyword.Type.List:
      const list: AllTypes[] = [];
      for (let elem of expr.value as ListLiteral) {
        list.push(evaluate(elem, env));
      }
      return list;
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
