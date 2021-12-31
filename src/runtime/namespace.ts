import { Any } from "../factory";

type Store = Map<string, Any>;

/**
 * saves variables, functions, and so on in each namespace
 */
export default class Namespace {
  /**
   * saves key value pairs.
   */
  private dict: Store = new Map<string, Any>();

  /**
   *
   * @param parent nesting scope
   */
  constructor(private readonly parent?: Namespace) {}

  /**
   * searches identifier and return its value
   * @param key identifier
   */
  lookUp(key: string): Any | undefined {
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
  register(key: string, value: Any): void {
    this.dict.set(key, value);
  }
}
