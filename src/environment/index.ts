import Address from "./address";
import Command from "../commands/command";

class Environment {
  public address: Address;
  constructor(public code: Command[]) {
    this.address = new Address(1, 0);
  }
}

export default Environment;
