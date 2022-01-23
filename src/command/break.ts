import Command from "./command";
import Environment from "../runtime/environment";
import { Kind } from "../runtime/block";
import { InvalidBreak } from "../error";

/**
 * break a loop
 */
export default class Break implements Command {
  constructor() {}
  execute(env: Environment) {
    while (true) {
      const block = env.blocks.pop();
      if (
        block?.kind === Kind.While ||
        block?.kind === Kind.ForRange ||
        block?.kind === Kind.ForEach
      ) {
        env.address.shift(-1);
        break;
      } else if (block?.kind === Kind.Ifs || block?.kind === Kind.IfElifElse) {
        env.address.shift(-1);
        continue;
      } else {
        throw new InvalidBreak();
      }
    }
  }
}
