import Command from "../commands/command";
import Environment from "../environment";
import { Handler, evaluate } from ".";
import Assignment from '../commands/assignment';
import Type from "../type";
import { Expression } from "../expressions";
import Variable from '../expressions/variable';
import * as Keyword from '../keywords';

export const handleAssignment: Handler = (cmd: Command, env: Environment) => {
  const assignment = cmd as Assignment;
  const rhsValue = evaluate(assignment.rhs, env);
  assign(assignment.lhs, rhsValue, env);
}

const assign = (ref: Expression, value: Type, env: Environment) => {
  switch (ref.kind) {
    case Keyword.Reference.Variable:
      const variable = ref.content as Variable;
      env.context.register(variable.name, value);
      break;
    default:
      break;
  }
}
