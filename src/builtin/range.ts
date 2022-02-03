import Environment from "../runtime/environment";
import { Expression } from "../expression";
import { InternalType } from "../type";
import { retrieveValue } from "../util";
import createIterator from "../factory/iterator";
import { createInt } from "../factory";
import FuncBody from "./funcBody";

/**
 * built-in `range()` function
 * @param args start, stop, step
 * @param env
 * @returns a range object (i.e. iterator)
 */
const range: FuncBody = (
  args: Expression[],
  env: Environment
): InternalType => {
  let start: number, stop: number, step: number;
  if (args.length === 1) {
    start = 0;
    stop = retrieveValue(args[0], env) as number;
    step = 1;
  } else if (args.length === 2) {
    start = retrieveValue(args[0], env) as number;
    stop = retrieveValue(args[1], env) as number;
    step = 1;
  } else {
    start = retrieveValue(args[0], env) as number;
    stop = retrieveValue(args[1], env) as number;
    step = retrieveValue(args[2], env) as number;
  }
  let counter: number | null = null;
  const rangeObject = createIterator({
    name: "range object",
    next: (index) => {
      if (counter === null) {
        counter = start;
      } else {
        counter += step;
      }
      if (counter >= stop) return null;
      return createInt(counter);
    },
  });
  return rangeObject;
};

export default range;
