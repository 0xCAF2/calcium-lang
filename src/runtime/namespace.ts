import { InternalType } from "../type";

type Store = Map<string, InternalType>;

/**
 * saves variables, functions, and so on in each namespace
 */
export abstract class Namespace {
  /**
   * saves key value pairs.
   */
  private dict: Store = new Map<string, InternalType>();

  /**
   *
   * @param parent nesting scope
   */
  constructor(public readonly parent?: Namespace) {}

  /**
   * searches identifier and return its value
   * @param key identifier
   */
  lookUp(key: string): InternalType | undefined {
    return this.dict.get(key);
  }

  /**
   *
   * @param key identifier
   * @param value right hand side of assignment
   */
  register(key: string, value: InternalType): void {
    this.dict.set(key, value);
  }
}

/**
 * the global scope
 */
export class Global extends Namespace {}

/**
 * function's local scope
 */
export class Local extends Namespace {}
