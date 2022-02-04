import { default as Sym } from "../symbol";
import { Expression } from ".";

export default class KwArg {
  constructor(
    public readonly keyword: string,
    public readonly value: Expression
  ) {}

  get [Sym.description](): string {
    return `${this.keyword}=${Reflect.get(this.value, Sym.description)}`;
  }
}
