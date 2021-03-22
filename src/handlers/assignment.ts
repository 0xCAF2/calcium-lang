import Environment from "../environment";
import { evaluate, Handler } from ".";
import { DictType, isDict, SomeType } from "../type";
import { Reference, Subscript, Variable } from "../expressions";
import * as Keyword from '../keywords';
import Command from "../commands/command";
import Assignment from "../commands/assignment";
import { CannotApplySubscript, IndexMustBeInt, KeyMustBeStr } from "../errors";

export const handleAssignment: Handler = (cmd: Command, env: Environment) => {
  const assignment = cmd as Assignment;
  const rhsValue = evaluate(assignment.rhs, env);
  assign(assignment.lhs, rhsValue, env);
}

const assign = (ref: Reference, value: SomeType, env: Environment) => {
  switch (ref.kind) {
    case Keyword.Reference.Variable:
      env.context.register((ref as Variable).name, value);
      break;
    case Keyword.Reference.Subscript:
      const subscript = ref as Subscript;
      const listOrDict = evaluate(subscript.container, env);
      if (listOrDict instanceof Array) {
        if (typeof subscript.indexOrKey === 'number') {
          // list
          listOrDict[subscript.indexOrKey] = value;
          break;
        } else {
          throw new IndexMustBeInt();
        }
      } else if (isDict(listOrDict)) {
        if (typeof subscript.indexOrKey === 'string') {
          // dict
          (listOrDict as DictType)[subscript.indexOrKey] = value;
          break;
        } else {
          throw new KeyMustBeStr();
        }
      }
      throw new CannotApplySubscript();
    default:
      break;
  }
}
