import Command from "./command";
import Environment from "../runtime/environment";
import { Expression, Reference } from "../expression";
import { Block, Kind, Result } from "../runtime/block";
import { evaluate } from "../util";
import { default as Sym } from "../symbol";

/**
 * for loop
 */
export default class For implements Command {
  constructor(
    public readonly variable: Reference,
    public readonly iterable: Expression
  ) {}

  execute(env: Environment) {
    const iterator = Reflect.get(evaluate(this.iterable, env), Sym.iter);
    const block = new Block(
      Kind.For,
      env.address,
      (env) => {
        const nextValue = Reflect.get(iterator, Sym.next);
        if (nextValue === null) {
          return false;
        }
        this.variable.assign(nextValue, env);
        return true;
      },
      (env) => {
        block.willEnter(env);
        return Result.Jumpped;
      }
    );
    block.willEnter(env);
  }
}
