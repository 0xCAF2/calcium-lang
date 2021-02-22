import Result from "./result";
import Status from './status';

class Engine {
  run(): Result {
    return this.step();
  }
  step(): Result {
    return { status: Status.Running };
  }
}

export default Engine;
