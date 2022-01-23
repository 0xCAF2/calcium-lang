import { Expression } from "../expression";
import { RawType } from "../type";
import { default as Sym } from "../symbol";
import Environment from "../runtime/environment";
import evaluate from "./evaluate";

export default function retrieveValue(
  target: Expression,
  env: Environment
): RawType {
  return Reflect.get(evaluate(target, env), Sym.value);
}
