import Command from "./command";
import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { default as Sym } from "../symbol";
import LoopCounter from "../runtime/loopCounter";
import { Block, Kind, Result } from "../runtime/block";
import { InternalType } from "../type";
import { NotIterable } from "../error";
import { evaluate } from "../util";

export default class ForEach implements Command {
  constructor(
    public readonly elemName: string,
    public readonly iterable: Expression
  ) {}
  execute(env: Environment) {
    const iterableObj = evaluate(this.iterable, env);
    let count: number;
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
        block.enter(env);
        return Result.Jumpped;
      }
    );
    block.enter(env);
  }
}
