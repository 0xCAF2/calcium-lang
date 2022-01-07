import Environment from "../runtime/environment";
import Address from "./address";

/**
 * when returns true, the block should be executed.
 */
export type Enter = (env: Environment) => boolean;

/**
 * executed when the block ends
 * The returned value represents a result when a `Block` ends with
 * a jump over two or more points on the address.
 */
export type Exit = (env: Environment) => Result;

/**
 * the kind of a `Block`
 */
export enum Kind {
  Ifs = "Ifs",
  IfElifElse = "IfElifElse",
  ForRange = "ForRange",
  ForEach = "ForEach",
  While = "While",
  Call = "Call",
  ClassDef = "ClassDef",
  Try = "Try",
  Except = "Except",
}

export enum Result {
  /**
   * an exception has occurred
   */
  Invalid = "Invalid",
  /**
   * moved over two or more points
   */
  Jumpped = "Jumpped",
  /**
   * shifted one point only
   */
  Exited = "Shifted",
}

/**
 */
const results: Map<Kind, Result> = new Map([
  [Kind.Ifs, Result.Exited],
  [Kind.IfElifElse, Result.Jumpped],
  [Kind.ForRange, Result.Jumpped],
  [Kind.ForEach, Result.Jumpped],
  [Kind.While, Result.Jumpped],
  [Kind.Call, Result.Jumpped],
  [Kind.ClassDef, Result.Exited],
  [Kind.Try, Result.Exited],
  [Kind.Except, Result.Exited],
]);

/**
 * a syntactic scope
 */
export class Block {
  readonly address: Address;

  /**
   *
   * @param kind
   * @param address
   * @param shouldEnter determine whether this block should be executed
   * @param willExit executed before this block ends
   */
  constructor(
    public readonly kind: Kind,
    address: Address,
    private readonly shouldEnter: Enter,
    private readonly willExit: Exit
  ) {
    this.address = address.clone();
  }

  willEnter(env: Environment) {
    env.address = this.address.clone();
    if (this.shouldEnter(env)) {
      env.address.shift(1);
      env.blocks.push(this);
    }
  }

  exit(env: Environment): Result {
    env.blocks.pop();
    if (env.exceptionThrown) {
      return Result.Invalid;
    }
    return this.willExit(env); // each command can have their own result
  }
}
