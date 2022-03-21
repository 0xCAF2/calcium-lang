import Address from "../runtime/address";
import { Block, Kind, Result } from "../runtime/block";
import Environment from "../runtime/environment";
import Namespace from "../runtime/namespace";
import { FunctionCalled } from "../error";
import { Expression } from "../expression";
import evaluate from "./evaluate";

export default function invoke({
  address,
  args,
  env,
  params,
  parent,
}: {
  address: Address;
  args: Expression[];
  env: Environment;
  params: string[];
  parent: Namespace;
}): never {
  const callerAddr = env.address.clone();
  const local = new Namespace(parent);
  for (let i = 0; i < args.length; ++i) {
    local.register(params[i], evaluate(args[i], env));
  }
  const calleeAddr = address.clone();
  calleeAddr.call = callerAddr.call + 1;
  const block = new Block(
    Kind.Call,
    calleeAddr,
    (env) => {
      env.callStack.push(env.context);
      env.context = local;
      return true;
    },
    (env) => {
      env.address.jump(callerAddr);
      env.address.call -= 1;
      env.address.skip(-1);
      env.context = env.callStack.pop()!;
      return Result.Jumpped;
    }
  );
  block.willEnter(env);
  throw new FunctionCalled();
}
