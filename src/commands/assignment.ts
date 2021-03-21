import { Expression, Reference } from '../expressions';
import Command from './command';

interface Assignment extends Command {
  lhs: Reference;
  rhs: Expression;
}

export default Assignment;
