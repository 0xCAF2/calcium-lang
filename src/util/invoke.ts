import { Expression, Reference } from "../expression";
import { None } from "../factory";
import Address from "../runtime/address";
import { Block, Kind, Result } from "../runtime/block";
import Environment from "../runtime/environment";
import Namespace from "../runtime/namespace";
import evaluate from "./evaluate";

export default function invoke(f: {
  address: Address;
  args: Expression[];
  env: Environment;
  lhs: Reference;
  params: string[];
  parent: Namespace;
}) {
  const callerAddress = f.env.address.clone();
  const local = new Namespace(f.parent);
  for (let i = 0; i < f.args.length; ++i) {
    local.register(f.params[i], evaluate(f.args[i], f.env));
  }

  const block = new Block(
    Kind.Call,
    f.address,
    (env) => {
      env.stack.push(env.context);
      env.context = local;
      return true;
    },
    (env) => {
      env.address.jump(callerAddress);
      env.context = env.stack.pop()!;
      if (f.lhs !== null) {
        f.lhs.assign(env.returnedValue, env);
      }
      env.returnedValue = None;
      return Result.Jumpped;
    }
  );
  block.willEnter(f.env);
}
