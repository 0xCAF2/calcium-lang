import Expression from '../expressions/expression';
import Reference from '../expressions/reference';
import Command from './command';

interface Assignment extends Command {
  lhs: Reference;
  rhs: Expression;
}

export default Assignment;
