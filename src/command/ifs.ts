import Command from "./command";
import Environment from "../runtime/environment";
import { Block, Kind } from "../runtime/block";

export default class Ifs implements Command {
  constructor() {}
  execute(env: Environment) {
    const block = new Block(
      Kind.Ifs,
      env.address,
      () => true,
      (env) => env.address.shift(-1)
    );
    block.enter(env);
  }
}
