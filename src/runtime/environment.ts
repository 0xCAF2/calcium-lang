import Address from "./address";
import Keyword from "../keyword";
import { PrintFunction } from ".";
import Statement from "./statement";

export default class Environment {
  /**
   * a current point of the execution
   */
  address = new Address(1, 0);

  /**
   * an array that contains code lines
   */
  code: Statement[];

  /**
   * an external function to output from built-in print function
   */
  printFunc?: PrintFunction;

  /**
   *
   * @param code must be a valid JSON array or its stringified representation.
   */
  constructor(code: string | Statement[]) {
    if (typeof code === "string") {
      this.code = JSON.parse(code);
    } else {
      this.code = code;
    }
  }

  /**
   *
   * @returns next `Command` object to be executed
   */
  findNextLine(): Statement {
    return [1, [], Keyword.Command.Comment, "0_18"];
  }

  /**
   * get the current line index on the execution
   */
  get currentLineIndex(): number {
    return this.address.index;
  }
}
