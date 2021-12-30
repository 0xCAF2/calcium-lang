import BaseObj from "./baseObj";

export default class Str extends BaseObj {
  constructor(public readonly value: string) {
    super();
  }
}
