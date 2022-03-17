import { InternalType } from "../type";
import { Expression, Reference } from "./index";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";
import { builtinFunctionOrMethod, None } from "../factory";

/**
 * use a unary operator and calculate
 */
export default class Call {
  private returnedValue: InternalType | undefined = undefined;
  private willGetReturnedValue = false;
  constructor(
    public readonly funcRef: Reference,
    public readonly args: Expression[]
  ) {}

  [Sym.evaluate](env: Environment): InternalType {
    if (this.returnedValue === undefined) {
      if (this.willGetReturnedValue) {
        this.returnedValue = env.returnedValue;
        env.returnedValue = None;
        return this.returnedValue;
      }

      const func = evaluate(this.funcRef, env);
      if (Reflect.get(func, Sym.class) === builtinFunctionOrMethod) {
        this.willGetReturnedValue = false;
      } else {
        this.willGetReturnedValue = true;
      }
      // FunctionCalled could be thrown
      const result = Reflect.get(func, Sym.call)(this.args, env);
      return result;
    } else {
      return this.returnedValue;
    }
  }
}
