import Result from "./result";
import Status from './status';
import Command from './commands/command';
import Environment from "./environment";
import * as Keyword from './keywords';
import { handleAssignment } from "./handlers";
import { threadId } from "worker_threads";

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
    const cmd = this.env.currentLine;
    this.handle(cmd);
    this.env.address.index += 1;
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
