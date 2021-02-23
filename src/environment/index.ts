import Address from "./address";
import Command from "../commands/command";
import { Scope, GlobalScope } from './scope';

class Environment {
  public address: Address;
  public context: Scope;

  constructor(public code: Command[]) {
    this.address = new Address(1, 0);
    this.context = new GlobalScope();
  }
  get currentLine(): Command {
    return this.code[this.address.index];
  }
}

export default Environment;
