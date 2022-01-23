import * as Cmd from "../command";
import createBuiltinFunction from "../factory/builtinFunction";
import Environment from "./environment";
import Namespace from "./namespace";
import Parser from "../parser";
import Statement from "./statement";
import Status from "./status";
import * as Builtin from "../builtin";
import { InternalType } from "../type";
import Index from "../indexes";
import { Result } from "./block";
import { FunctionCalled, InconsistentBlock } from "../error";
import * as Kw from "../keyword";
import OutputFunction from "./outputFunction";
import Address from "./address";
import { None } from "../factory";

export default class Runtime {
  breakpoints = new Set<number>();

  /**
   * has data required on execution.
   */
  env: Environment;

  /**
   * a utility flag to execute on a Worker
   */
  isPaused = false;

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
    for (let name in Builtin.Functions) {
      const builtinFunc = createBuiltinFunction({
        name,
        body: Builtin.Functions[name],
      }) as InternalType;
      builtin.register(name, builtinFunc);
    }
    const env = new Environment(code, builtin);
    this.env = env;
  }

  addBreakpoint(line: number) {
    this.breakpoints.add(line);
  }

  pause() {
    this.isPaused = true;
  }

  removeBreakpoint(line: number) {
    this.breakpoints.delete(line);
  }

  resume() {
    this.isPaused = false;
  }

  run(): Status {
    if (this.env.address.line >= this.env.code.length) {
      return Status.Terminated;
    }
    while (true) {
      const result = this.step();
      if (result !== Status.Running) {
        return result;
      } else {
        continue;
      }
    }
  }

  /**
   *
   * @param funcToOutput built-in function's body to output
   */
  setOutputFunction(funcToOutput: OutputFunction) {
    this.env.funcToOutput = funcToOutput;
  }

  skipToNextLine() {
    let nextIndex: number;
    outer: while (true) {
      nextIndex = this.env.address.line + 1;
      inner: while (true) {
        const nextStmt = this.env.code[nextIndex];
        const nextIndent = nextStmt[Index.Statement.Indent];
        const delta = this.env.address.indent - nextIndent;
        if (delta > 0) {
          // some blocks must be popped.
          for (let i = 0; i < delta; ++i) {
            const result = this.env.lastBlock.exit(this.env);
            if (result === Result.Invalid) {
              throw new InconsistentBlock();
            } else if (result === Result.Jumpped) {
              continue outer;
            }
          }
          break outer;
        } else if (delta === 0) {
          break outer;
        } else {
          nextIndex += 1;
          continue inner;
        }
      }
    }
    this.env.address.line = nextIndex;
  }

  /**
   * execute one line.
   *
   * @returns the result of the execution
   */
  step(): Status {
    if (this.env.address.line >= this.env.code.length) {
      return Status.Terminated;
    }

    let stmt = this.currentStatement;
    let cmd = this.parser.read(stmt);
    if (cmd instanceof Cmd.End) {
      return Status.Terminated;
    }

    const callerAddress = this.env.address.clone();
    const lastCommand =
      this.env.commandsWithCall[this.env.commandsWithCall.length - 1];
    if (lastCommand && callerAddress.isAt(lastCommand.address)) {
      cmd = lastCommand.command;
      const returnedValue = this.env.commandsWithCall.pop()?.returnedValue;
      if (returnedValue) {
        this.env.returnedValue = returnedValue;
      }
    }

    try {
      cmd.execute(this.env);
    } catch (e) {
      if (e instanceof FunctionCalled) {
        this.env.commandsWithCall.push({
          address: callerAddress,
          command: cmd,
          returnedValue:
            this.env.returnedValue === None
              ? undefined
              : this.env.returnedValue,
        });
      } else {
        throw e;
      }
    }

    if (this.isPaused) return Status.Paused;

    this.skipToNextLine();

    stmt = this.currentStatement;
    let kw = stmt[Index.Statement.Keyword];
    // pass through Ifs and Comment commands
    while (kw === Kw.Command.Ifs || kw === Kw.Command.Comment) {
      const cmd = this.parser.read(stmt);
      cmd.execute(this.env);
      this.skipToNextLine();
      stmt = this.currentStatement;
      kw = stmt[Index.Statement.Keyword];
    }

    if (this.breakpoints.has(this.env.address.line)) return Status.AtBreakpoint;
    return Status.Running;
  }

  get currentStatement(): Statement {
    return this.env.code[this.env.address.line];
  }
}

export type Options = {
  parser?: Parser;
  builtins?: { [name: string]: Builtin.FuncBody };
};
