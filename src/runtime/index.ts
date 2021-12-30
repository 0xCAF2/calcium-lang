import { BuiltinFunctions, BuiltinFuncBody } from "../builtin";
import { BuiltinFunc } from "../type";
import Environment from "./environment";
import Namespace from "./namespace";
import Parser from "../parser";
import Statement from "./statement";
import Status from "./status";

export default class Runtime {
  /**
   * has data required on execution.
   */
  env: Environment;

  /**
   * parses a statement in JSON arrays, then returns a command.
   */
  parser: Parser;

  /**
   *
   * @param code must be a string or a JSON array of Calcium statements.
   */
  constructor(code: string | Statement[], opt?: Options) {
    this.parser = opt?.parser ?? new Parser();
    // set up built-ins
    const builtin = new Namespace();
    for (let name in BuiltinFunctions) {
      const builtinFunc = new BuiltinFunc(name, BuiltinFunctions[name]);
      builtin.register(name, builtinFunc);
    }
    const env = new Environment(code, builtin);
    this.env = env;
  }

  /**
   *
   * @param funcToOutput built-in function's body to output
   */
  setOutputFunction(funcToOutput: OutputFunction) {
    this.env.funcToOutput = funcToOutput;
  }

  /**
   * execute one line.
   *
   * @returns the result of the execution
   */
  step(): Status {
    const stmt = this.env.findNextLine();
    const cmd = this.parser.read(stmt);
    cmd.execute(this.env);
    return Status.Terminated;
  }
}

export type OutputFunction = (desc: string) => void;

export type Options = {
  parser?: Parser;
  builtins?: { [name: string]: BuiltinFuncBody };
};
