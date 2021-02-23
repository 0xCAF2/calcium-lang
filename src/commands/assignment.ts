import { Expression } from '../expressions';
import Reference from '../expressions/reference';
import Command from './command';

interface Assignment extends Command {
  lhs: Expression;
  rhs: Expression;
}

export default Assignment;
