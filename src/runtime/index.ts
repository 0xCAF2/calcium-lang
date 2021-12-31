import * as Cmd from "../command";
import createBuiltinFunc from "../type/builtinFunc";
import Environment from "./environment";
import Namespace from "./namespace";
import Parser from "../parser";
import Statement from "./statement";
import Status from "./status";
import { functions, FuncBody } from "../builtin";
import { InternalType } from "../expression";

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
    for (let name in functions) {
      const builtinFunc = createBuiltinFunc(
        name,
        functions[name]
      ) as InternalType;
      builtin.register(name, builtinFunc);
    }
    const env = new Environment(code, builtin);
    this.env = env;
  }

  /**
   *
   * @returns next `Statement` object to be executed
   */
  findNextLine(): Statement {
    const stmt = this.env.code[this.env.address.index];
    this.env.address.index += 1;
    return stmt;
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
    if (this.env.address.index >= this.env.code.length) {
      return Status.Terminated;
    }
    const stmt = this.findNextLine();
    const cmd = this.parser.read(stmt);
    if (cmd instanceof Cmd.End) {
      return Status.Terminated;
    }
    cmd.execute(this.env);
    return Status.Running;
  }
}

export type OutputFunction = (desc: string) => void;

export type Options = {
  parser?: Parser;
  builtins?: { [name: string]: FuncBody };
};
