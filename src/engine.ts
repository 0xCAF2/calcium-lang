import Result from "./result";
import Status from './status';
import Environment from "./environment";
import * as Keyword from './keywords';
import { handleAssignment } from "./handlers";
import Command from "./commands/command";

class Engine {
  public env: Environment;
  constructor(public code: Command[]) {
    this.env = new Environment(code);
  }
  get currentIndex(): number {
    return this.env.address.index;
  }
  run(): Result {
    let result: Result = { status: Status.Terminated };
    while (this.currentIndex < this.env.code.length) {
      this.step();
    }
    return result;
  }
  step(): Result {
    const line = this.env.currentLine;
    this.execute(line);
    this.env.address.index += 1;
    return { status: Status.Running };
  }
  private execute(line: Command) {
    switch (line.keyword) {
      case Keyword.Command.Assignment:
        handleAssignment(line, this.env);
        break;
      default:
        break;
    }
  }
}

export default Engine;
