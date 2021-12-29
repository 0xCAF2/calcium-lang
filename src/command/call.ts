import Command from ".";
import Environment from "../runtime/environment";
import { Reference } from "../expression";

export default class Call implements Command {
  constructor(
    public readonly lhs: Reference | null,
    public readonly funcRef: Reference,
    public readonly args: unknown[]
  ) {}

  execute(env: Environment): void {
    console.log("Hello, World.");
  }
}
