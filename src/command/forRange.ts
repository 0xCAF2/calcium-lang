import Command from "./command";
import Environment from "../runtime/environment";
import * as Expr from "../expression";
import LoopCounter from "../runtime/loopCounter";
import retrieveValue from "../runtime/retrieveValue";
import { Block, Kind, Result } from "../runtime/block";
import { createInt } from "../factory";

/**
 * `for i in range(start, stop, step):` loop
 */
export default class ForRange implements Command {
  constructor(
    public readonly varName: string,
    public readonly start: Expr.Expression | null,
    public readonly stop: Expr.Expression,
    public readonly step: Expr.Expression | null
  ) {}

  execute(env: Environment) {
    let loopCounter: LoopCounter;
    const stopValue = retrieveValue(this.stop, env) as number;
    if (this.start === null && this.step === null) {
      // e.g. for i in range(10):
      loopCounter = new LoopCounter(0, stopValue, 1);
    } else if (this.start !== null && this.step === null) {
      // e.g. for i in range(1, 11):
      const startValue = retrieveValue(this.start, env) as number;
      loopCounter = new LoopCounter(startValue, stopValue, 1);
    } else if (this.start !== null && this.step !== null) {
      // e.g. for i in range(0, 22, 2):
      const startValue = retrieveValue(this.start, env) as number;
      const stepValue = retrieveValue(this.step, env) as number;
      loopCounter = new LoopCounter(startValue, stopValue, stepValue);
    }
    const block = new Block(
      Kind.ForRange,
      env.address,
      (env) => {
        const nextValue = loopCounter.next();
        if (nextValue !== null) {
          env.context.register(this.varName, createInt(nextValue));
          return true;
        } else {
          return false;
        }
      },
      (env) => {
        block.enter(env);
        return Result.Jumpped;
      }
    );
    block.enter(env);
  }
}
