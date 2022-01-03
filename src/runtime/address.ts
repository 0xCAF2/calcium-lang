/**
 * Represent the point of the execution or function's address.
 */
export default class Address {
  /**
   *
   * @param indent corresponds to Python's indent
   * @param line line number (index in the code array)
   */
  constructor(public indent: number, public line: number) {}

  /**
   * Make a copy
   */
  clone() {
    return new Address(this.indent, this.line);
  }

  /**
   * jump and go to the specified address
   * @param toPoint
   */
  jump(toPoint: Address) {
    this.indent = toPoint.indent;
    this.line = toPoint.line;
  }

  /**
   * add the delta to the indent
   * @param x the delta of the indent
   */
  shift(x: number) {
    this.indent += x;
  }

  /**
   * add the delta to the line number
   * @param y the delta of the line number
   */
  skip(y: number) {
    this.line += y;
  }
}
