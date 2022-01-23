/**
 * control a loop in runtime
 */
export default class LoopCounter {
  private now: number | null = null;

  constructor(
    public readonly start: number,
    public readonly stop: number,
    public readonly step: number = 1
  ) {}

  next(): number | null {
    if (
      (this.step > 0 && this.start >= this.stop) ||
      (this.step < 0 && this.start <= this.stop)
    ) {
      return null;
    } else if (this.now === null) {
      this.now = this.start;
      return this.start;
    } else {
      this.now += this.step;
      if (this.step > 0) {
        return this.now >= this.stop ? null : this.now;
      } else if (this.step < 0) {
        return this.now <= this.stop ? null : this.now;
      } else {
        return null;
      }
    }
  }
}
