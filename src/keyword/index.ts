import {
  BinaryOperator,
  Command,
  Reference,
  Syntax,
  UnaryOperator,
} from "./keywords";

export { BinaryOperator, Command, Reference, Syntax, UnaryOperator };

const binOps: Set<string> = new Set();
for (let v of Object.values(BinaryOperator)) {
  binOps.add(v);
}

export { binOps as BinaryOperatorsSet };
