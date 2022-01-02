import Command from "./command";
import Environment from "../runtime/environment";
import * as Expr from "../expression";
import { createInternalType, InternalType } from "../factory";
import retrieveValue from "../runtime/retrieveValue";
import { ObjectNotIterable } from "../error";
import { default as Sym } from "../symbol";
import LoopCounter from "../runtime/loopCounter";
import { Block, Kind, Result } from "../runtime/block";

export default class ForEach implements Command {
  constructor(
    public readonly elemName: string,
    public readonly iterable: Expr.Expression
  ) {}
  execute(env: Environment) {
    const iterableObj = retrieveValue(this.iterable, env);
    let count: number;
    let getElemValue: (index: number) => InternalType;
    if (typeof iterableObj === "string" || Array.isArray(iterableObj)) {
      count = iterableObj.length;
      getElemValue = (i) => createInternalType(iterableObj[i]);
    } else if (
      typeof iterableObj === "object" &&
      iterableObj !== null &&
      Reflect.has(iterableObj, Sym.keys)
    ) {
      const keysMethod = Reflect.get(iterableObj, Sym.keys);
      const keys = Reflect.apply(keysMethod, iterableObj, []) as string[];
      count = keys.length;
      getElemValue = (i) =>
        createInternalType(Reflect.get(iterableObj, keys[i]));
    } else {
      throw new ObjectNotIterable();
    }
    const loopCounter = new LoopCounter(0, count);
    const block = new Block(
      Kind.ForEach,
      env.address,
      (env) => {
        const nextIndex = loopCounter.next();
        if (nextIndex !== null) {
          env.context.register(this.elemName, getElemValue(nextIndex));
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
