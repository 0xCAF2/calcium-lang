import * as Type from "../type";

type Store = Map<string, Type.Any>;

/**
 * saves variables, functions, and so on in each namespace
 */
export default class Namespace {
  /**
   * saves key value pairs.
   */
  private dict: Store = new Map<string, Type.Any>();

  /**
   *
   * @param parent nesting scope
   */
  constructor(private readonly parent?: Namespace) {}

  /**
   * searches identifier and return its value
   * @param key identifier
   */
  lookUp(key: string): Type.Any | undefined {
    const value = this.dict.get(key);
    if (value !== undefined) {
      return value;
    } else {
      return this.parent?.lookUp(key);
    }
  }

  /**
   *
   * @param key identifier
   * @param value right hand side of assignment
   */
  register(key: string, value: Type.Any): void {
    this.dict.set(key, value);
  }
}
