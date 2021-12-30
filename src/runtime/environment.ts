import Address from "./address";
import { default as Kw } from "../keyword";
import Namespace from "./namespace";
import { OutputFunction } from ".";
import Statement from "./statement";

export default class Environment {
  /**
   * the current point of the execution
   */
  address = new Address(1, 0);

  /**
   * an array that contains code lines
   */
  code: Statement[];

  /**
   * the current context that has associations from a name to a value
   */
  context: Namespace;

  /**
   * an external function to output from built-in print function
   */
  funcToOutput?: OutputFunction;

  /**
   *
   * @param code must be a valid JSON array or its stringified representation.
   *
   */
  constructor(code: string | Statement[], builtin: Namespace) {
    if (typeof code === "string") {
      this.code = JSON.parse(code);
    } else {
      this.code = code;
    }
    const global = new Namespace(builtin);
    this.context = global;
  }

  /**
   *
   * @returns next `Command` object to be executed
   */
  findNextLine(): Statement {
    return [1, [], Kw.Command.Comment, "0_18"];
  }

  /**
   * get the current line index on the execution
   */
  get currentLineIndex(): number {
    return this.address.index;
  }
}
