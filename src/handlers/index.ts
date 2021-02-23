import Command from '../commands/command';
import Environment from '../environment';
import Expression from '../expressions';
import * as Keyword from '../keywords';
import Type from '../type';

export * from './assignment';

export type Handler = (cmd: Command, env: Environment) => void;

export function evaluate(value: Expression, env: Environment): Type {
  switch (value.kind) {
    case Keyword.Expression.Int:
      return value.content;
    default:
      return null;
  }
}
