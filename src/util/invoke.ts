import { Expression } from "../expression";
import { None } from "../factory";
import Address from "../runtime/address";
import { Block, Kind, Result } from "../runtime/block";
import Environment from "../runtime/environment";
import Namespace from "../runtime/namespace";
import { FunctionCalled } from "../error";
import { InternalType } from "../type";

export default function invoke({
  address,
  args,
  env,
  params,
  parent,
}: {
  address: Address;
  args: InternalType[];
  env: Environment;
  params: string[];
  parent: Namespace;
}) {
  const callerAddress = env.address.clone();
  const local = new Namespace(parent);
  for (let i = 0; i < args.length; ++i) {
    local.register(params[i], args[i]);
  }
  const calleeAddress = address.clone();
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
  block.willEnter(env);
  throw new FunctionCalled();
}
