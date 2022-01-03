import Command from "./command";
import Environment from "../runtime/environment";
import { createFuncObj } from "../factory";

export default class Def implements Command {
  constructor(
    public readonly funcName: string,
    public readonly paramsName: string[]
  ) {}
  execute(env: Environment) {
    const definedAddress = env.address.clone();
    const funcObj = createFuncObj({
      address: definedAddress,
      name: this.funcName,
      params: this.paramsName,
      parent: env.context.nestingScope,
    });
    env.context.register(this.funcName, funcObj);
  }
}
