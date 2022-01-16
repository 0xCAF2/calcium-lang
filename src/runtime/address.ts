/**
 * Represent the point of the execution or function's address.
 */
export default class Address {
  /**
   *
   */
  /**
   *
   * @param indent corresponds to Python's indent
   * @param line line number (index in the code array)
   * @param file module index
   * @param call call counter for a recursive function
   */
  constructor(
    public indent: number,
    public line: number,
    public file: number = 0,
    public call: number = 0
  ) {}

  /**
   * Make a copy
   */
  clone() {
    return new Address(this.indent, this.line, this.file, this.call);
  }

  /**
   *
   * @param address another address
   * @returns whether two addresses are at same position
   */
  isAt(address: Address): boolean {
    return (
      this.indent === address.indent &&
      this.line === address.line &&
      this.file === address.file &&
      this.call === address.call
    );
  }

  /**
   * jump and go to the specified address
   * @param toPoint
   */
  jump(toPoint: Address) {
    this.indent = toPoint.indent;
    this.line = toPoint.line;
    this.file = toPoint.file;
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
