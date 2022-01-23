import { InternalType } from "../type";
import { None } from "../factory";
import { SliceNotSupported } from "../error";

export default class Slice {
  constructor(private readonly list: InternalType[] | string) {}

  get(lower: InternalType, upper: InternalType): InternalType[] | string {
    const [start, end] = this.getRange(lower, upper);
    return this.list.slice(start, end);
  }

  set(lower: InternalType, upper: InternalType, value: InternalType[]) {
    const [start, count] = this.calcStartAndCount(lower, upper);
    if (typeof this.list !== "string") {
      this.list.splice(start, count, ...value);
    } else {
      throw new SliceNotSupported();
    }
  }

  private calcStartAndCount(
    lower: InternalType,
    upper: InternalType
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

  private getRange(lower: InternalType, upper: InternalType): [number, number] {
    const l = lower === None ? 0 : +lower;
    const u = upper === None ? this.list.length : +upper;
    return [l, u];
  }
}
