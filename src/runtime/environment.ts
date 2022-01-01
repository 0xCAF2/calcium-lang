import Address from "./address";
import { Block } from "./block";
import Namespace from "./namespace";
import { OutputFunction } from ".";
import Statement from "./statement";

export default class Environment {
  /**
   * the current point of the execution
   */
  address = new Address(1, 0);

  /**
   * a stack of command blocks
   */
  blocks: Block[] = [];

  /**
   * an array that contains code lines
   */
  code: Statement[];

  /**
   * the current context that has associations from a name to a value
   */
  context: Namespace;

  exception?: Error;

  /**
   * an external function to output from built-in print function
   */
  funcToOutput?: OutputFunction;

  /**
   *
   * @param code must be a valid JSON array or its stringified representation.
   * @param builtin the namespace for built-in objects
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
   * get the current line index in the code array
   */
  get currentLineIndex(): number {
    return this.address.line;
  }

  get exceptionThrown(): boolean {
    return this.exception !== undefined;
  }

  get lastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }
}
