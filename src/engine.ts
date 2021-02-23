import Result from "./result";
import Status from './status';
import Command from './commands/command';
import Environment from "./environment";
import * as Keyword from './keywords';
import { handleAssignment } from "./handlers";

class Engine {
  public env: Environment;
  constructor(public code: Command[]) {
    this.env = new Environment(code);
  }
  get currentIndex(): number {
    return this.env.address.index;
  }
  run(): Result {
    return this.step();
  }
  step(): Result {
    const cmd = this.env.currentLine;
    this.handle(cmd);
    return { status: Status.Running };
  }
  private handle(cmd: Command) {
    switch (cmd.keyword) {
      case Keyword.Command.Assignment:
        handleAssignment(cmd, this.env);
        break;
      default:
        break;
    }
  }
}

export default Engine;
