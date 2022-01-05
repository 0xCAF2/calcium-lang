import { InternalType } from "../type";

type Store = Map<string, InternalType>;

/**
 * saves variables, functions, and so on in each namespace
 */
export default class Namespace {
  /**
   * saves key value pairs.
   */
  private dict: Store = new Map<string, InternalType>();

  /**
   *
   * @param parent nesting scope
   */
  constructor(
    public readonly parent?: Namespace,
    public readonly isClassScope = false
  ) {}

  get(key: string): InternalType | undefined {
    return this.dict.get(key);
  }

  /**
   * searches identifier and return its value
   * @param key identifier
   */
  lookUp(key: string): InternalType | undefined {
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
  register(key: string, value: InternalType) {
    this.dict.set(key, value);
  }

  /**
   * the parent scope of a function or a method
   * When this namespace is not a class scope, then returns this.
   */
  get nestingScope(): Namespace {
    let scope: Namespace = this;
    while (scope.parent!.isClassScope) {
      scope = scope.parent!;
    }
    return scope;
  }
}
