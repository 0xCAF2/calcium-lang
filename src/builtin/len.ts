import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { evaluate } from "../util";

export default function len(
  args: Expression[],
  env: Environment
): InternalType {
  const iterable = evaluate(args[0], env);
  const length = Reflect.get(iterable, Sym.len);
  return length;
}
