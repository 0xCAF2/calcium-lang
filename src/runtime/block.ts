import Environment from "../runtime/environment";
import Address from "./address";

export type Enter = (env: Environment) => boolean;
export type Exit = (env: Environment) => void;

export enum Kind {
  Ifs = "Ifs",
  IfElifElse = "IfElifElse",
  ForRange = "ForRange",
  ForEach = "ForEach",
  While = "While",
  Call = "Call",
  ClassDef = "ClassDef",
  Try = "Try",
  Except = "Except",
}

const hasJumppedOver: Map<Kind, boolean> = new Map([
  [Kind.Ifs, false],
  [Kind.IfElifElse, true],
  [Kind.ForRange, true],
  [Kind.ForEach, true],
  [Kind.While, true],
  [Kind.Call, true],
  [Kind.ClassDef, false],
  [Kind.Try, false],
  [Kind.Except, false],
]);

export enum Result {
  Invalid = "Invalid",
  Jumpped = "Jumpped",
  Shifted = "Shifted",
}

export class Block {
  address: Address;

  constructor(
    public readonly kind: Kind,
    address: Address,
    private readonly shouldEnter: Enter,
    private readonly willExit: Exit
  ) {
    this.address = address.clone();
  }

  enter(env: Environment) {
    env.address = this.address.clone();
    if (this.shouldEnter(env)) {
      env.address.shift(1);
      env.blocks.push(this);
    }
  }

  exit(env: Environment): Result {
    env.blocks.pop(); // this block should be popped from the stack
    if (env.exceptionThrown) {
      return Result.Invalid;
    }
    this.willExit(env);
    return hasJumppedOver.get(this.kind) ? Result.Jumpped : Result.Shifted;
  }
}
