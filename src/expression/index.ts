export class Variable {
  constructor(public readonly name: string) {}
}

export type Reference = Variable;

export type Literal = {};

export type Expression = Literal | Reference;
