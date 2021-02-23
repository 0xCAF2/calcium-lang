import Result from "./result";
import Status from './status';
import Command from './commands/command';
import Environment from "./environment";

class Engine {
  private env: Environment;
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
    return { status: Status.Running };
  }
}

export default Engine;
