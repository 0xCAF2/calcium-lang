import { Expression } from "../expression";
import { None } from "../factory";
import Address from "../runtime/address";
import { Block, Kind, Result } from "../runtime/block";
import Environment from "../runtime/environment";
import Namespace from "../runtime/namespace";
import { FunctionCalled } from "../error";
import { InternalType } from "../type";

export default function invoke(f: {
  address: Address;
  args: InternalType[];
  env: Environment;
  params: string[];
  parent: Namespace;
}) {
  const callerAddress = f.env.address.clone();
  const local = new Namespace(f.parent);
  for (let i = 0; i < f.args.length; ++i) {
    local.register(f.params[i], f.args[i]);
  }
  const calleeAddress = f.address.clone();
  calleeAddress.call = callerAddress.call + 1;
  const block = new Block(
    Kind.Call,
    calleeAddress,
    (env) => {
      env.stack.push(env.context);
      env.context = local;
      return true;
    },
    (env) => {
      env.address.jump(callerAddress);
      env.address.call -= 1;
      env.address.skip(-1);
      env.context = env.stack.pop()!;
      return Result.Jumpped;
    }
  );
  block.willEnter(f.env);
  throw new FunctionCalled();
}
