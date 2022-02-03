import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { None } from "../factory";
import Sym from "../symbol";
import { evaluate } from "../util";
import FuncBody from "./funcBody";
import { KwArg } from "../expression";
import { retrieveValue } from "../util";

/**
 * built-in `print()`
 * @param args values to be output
 * @param env
 * @returns `None`
 */
const print: FuncBody = (
  args: Expression[],
  env: Environment
): InternalType => {
  const result: string[] = [];
  let sep = " ";
  let end = "\n";
  for (let a of args) {
    if (a instanceof KwArg) {
      if (a.keyword === "sep") {
        const s = retrieveValue(a.value, env);
        if (typeof s === "string") {
          sep = s;
          continue;
        } else {
          throw new TypeError("sep must be a str.");
        }
      } else if (a.keyword === "end") {
        const e = retrieveValue(a.value, env);
        if (typeof e === "string") {
          end = e;
          continue;
        } else {
          throw new TypeError("end must be a str.");
        }
      }
    }
    const evaluated = evaluate(a, env);
    result.push(Reflect.get(evaluated, Sym.description));
  }
  if (env.funcToOutput) {
    env.funcToOutput(result.join(sep) + end);
  }
  return None;
};

export default print;
