import Command from "./command";
import Environment from "../runtime/environment";
import { Reference } from "../expression";
import { default as Sym } from "../symbol";
import { Block, Kind, Result } from "../runtime/block";
import { evaluate } from "../util";

/**
 * a foreach loop that don't use a function to get an iterable
 */
export default class ForEach implements Command {
  /**
   *
   * @param elemName the identifier of the retrieved object
   * @param iterable must refer to an iterable object
   */
  constructor(
    public readonly elemName: string,
    public readonly iterable: Reference
  ) {}
  execute(env: Environment) {
    const iterableObj = evaluate(this.iterable, env);
    const iterator = Reflect.get(iterableObj, Sym.iterator);
    const block = new Block(
      Kind.ForEach,
      env.address,
      (env) => {
        const nextValue = iterator.next();
        if (nextValue === undefined) {
          return false;
        } else {
          env.context.register(this.elemName, nextValue);
          return true;
        }
      },
      (env) => {
        block.willEnter(env);
        return Result.Jumpped;
      }
    );
    block.willEnter(env);
  }
}
