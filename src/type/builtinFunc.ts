import { BuiltinFuncBody } from "../builtin";

export default class BuiltinFunc {
  constructor(
    public readonly name: string,
    public readonly body: BuiltinFuncBody
  ) {}
}
