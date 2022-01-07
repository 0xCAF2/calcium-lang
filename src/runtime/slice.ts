import { InternalType } from "../type";
import { default as Sym } from "../symbol";
import { None } from "../factory";

export default class Slice {
  constructor(private readonly list: InternalType[]) {}

  get(
    lower: number | typeof None,
    upper: number | typeof None
  ): InternalType[] {
    const [start, end] = this.getRange(lower, upper);
    return this.list.slice(start, end);
  }

  set(
    lower: number | typeof None,
    upper: number | typeof None,
    value: InternalType[]
  ) {
    const [start, count] = this.calcStartAndCount(lower, upper);
    this.list.splice(start, count, ...value);
  }

  private calcStartAndCount(
    lower: number | typeof None,
    upper: number | typeof None
  ): [number, number] {
    let [l, u] = this.getRange(lower, upper);
    if (l < 0) {
      l += this.list.length;
      if (l < 0) {
        l = 0;
      }
    }
    if (u < 0) {
      u += this.list.length;
      if (u < 0) {
        u = 0;
      }
    }
    let count = u - l;
    if (count < 0) {
      count = 0;
    }
    return [l, count];
  }

  private getRange(
    lower: number | typeof None,
    upper: number | typeof None
  ): [number, number] {
    const l = lower === None ? 0 : (lower as number);
    const u = upper === None ? this.list.length : (upper as number);
    return [l, u];
  }
}
