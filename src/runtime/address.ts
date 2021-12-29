/**
 * Represent the point of the execution or function's address.
 */
export default class Address {
  /**
   *
   * @param indent corresponds to Python's indent
   * @param index line number (index in the code array)
   */
  constructor(public indent: number, public index: number) {}

  /**
   * Make a copy
   */
  clone() {
    return new Address(this.indent, this.index);
  }
}
