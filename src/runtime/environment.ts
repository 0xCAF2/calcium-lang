import Address from "./address";
import { Block } from "./block";
import Namespace from "./namespace";
import OutputFunction from "./outputFunction";
import Statement from "./statement";
import { InternalType } from "../type";
import { None } from "../factory";
import { Command } from "../command";

/**
 * the runtime environment that has data to control the execution
 */
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
   * used when a function call is returned, and the command is restarted
   */
  commandsWithCall: {
    address: Address;
    command: Command;
    returnedValue?: InternalType;
  }[] = [];

  /**
   * an array that contains code lines
   */
  code: Statement[];

  /**
   * the current context that has associations from a name to the value
   */
  context: Namespace;

  exception?: Error;

  /**
   * an external function to output from built-in print function
   */
  funcToOutput?: OutputFunction;

  /**
   * used to return a value from a function
   */
  returnedValue: InternalType = None;

  /**
   * a call stack
   */
  callStack: Namespace[] = [];

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

  /**
   * get the last block that had been entered
   */
  get lastBlock(): Block {
    return this.blocks[this.blocks.length - 1];
  }
}
