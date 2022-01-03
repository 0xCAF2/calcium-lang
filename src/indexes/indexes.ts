export enum Statement {
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
  FuncRef = 4,
  Args = 5,
}

export enum Class {
  Name = 3,
  SuperclassName = 4,
}

export enum Comment {
  Text = 3,
}

export enum Conditional {
  Expr = 3,
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
  Values = 4,
}

export enum FuncDef {
  Name = 3,
  Parameters = 4,
}

export enum Import {
  ModuleName = 3,
}

export enum Raise {
  Exception = 3,
  Args = 4,
}

export enum Return {
  Expr = 3,
}

export enum Expression {
  Keyword = 0,
}

export enum Attribute {
  ObjName = 1,
  PropertiesName = 2,
}

export enum BinaryOperator {
  Left = 1,
  Right = 2,
}

export enum Subscript {
  ReferredObj = 1,
  IndexExpr = 2,
  SliceStart = 2,
  SliceEnd = 3,
}

export enum UnaryOperator {
  Operand = 1,
}

export enum Variable {
  Name = 1,
}
