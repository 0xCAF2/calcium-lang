export enum Line {
  Indent = 0,
  Options = 1,
  Keyword = 2,
}

export enum Assignment {
  Lhs = 3,
  Rhs = 4,
}

export enum Call {
  Lhs = 3,
  Reference = 4,
  Args = 5,
}

export enum ClassDef {
  ClassName = 3,
  SuperclassName = 4,
}

export enum Comment {
  Text = 3,
}

export enum Condition {
  Expression = 3,
}

export enum Except {
  TypeName = 3,
  ObjName = 4,
}

export enum ForEach {
  ElementName = 3,
  Iterable = 4,
}

export enum ForRange {
  VariableName = 3,
  RangeArgs = 4,
}

export enum FuncDef {
  FuncName = 3,
  Parameters = 4,
}

export enum Import {
  ModuleName = 3,
}

export enum Raise {
  ExceptionName = 3,
  Args = 4,
}

export enum Return {
  Value = 3,
}

export enum Expression {
  Keyword = 0,
}

export enum Attribute {
  ObjName = 1,
  PropertyNames = 2,
}

export enum BinaryOperation {
  Left = 1,
  Right = 2,
}

export enum Subscript {
  Reference = 1,
  IndexExpr = 2,
}

export enum UnaryOperation {
  Operand = 1,
}

export enum Variable {
  Name = 1,
}
