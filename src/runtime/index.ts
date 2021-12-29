import { BuiltinFuncBody } from "../builtin";
import Environment from "./environment";
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
  constructor(code: string | Statement[], options?: Options) {
    this.env = new Environment(code);
    this.parser = options?.parser ?? new Parser();
  }

  /**
   *
   * @param printFunc built-in function to output
   */
  setPrintFunction(printFunc: PrintFunction) {
    this.env.printFunc = printFunc;
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

export type PrintFunction = (desc: string) => void;

export type Options = {
  parser?: Parser;
  builtins?: { [name: string]: BuiltinFuncBody };
};
