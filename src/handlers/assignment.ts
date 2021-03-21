import Environment from "../environment";
import { Handler, evaluate } from ".";
import { BuiltinTypes } from "../type";
import { Reference, Variable } from "../expressions";
import * as Keyword from '../keywords';
import Command from "../commands/command";
import Assignment from "../commands/assignment";

export const handleAssignment: Handler = (cmd: Command, env: Environment) => {
  const assignment = cmd as Assignment;
  const rhsValue = evaluate(assignment.rhs, env);
  assign(assignment.lhs, rhsValue, env);
}

const assign = (ref: Reference, value: BuiltinTypes, env: Environment) => {
  switch (ref.kind) {
    case Keyword.Reference.Variable:
      env.context.register((ref as Variable).name, value);
      break;
    default:
      break;
  }
}
