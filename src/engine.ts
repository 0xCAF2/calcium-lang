import Result from "./result";

import Status from './status';

class Engine {
  run(): Result {
    return this.step();
  }
  step(): Result {
    return new Result(Status.Running);
  }
}

export default Engine;
