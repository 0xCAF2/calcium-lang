export enum Statement {
  Indent = 0,
  Options = 1,
  Keyword = 2,
}

export enum Assign {
  Lhs = 3,
  Rhs = 4,
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

export enum For {
  Variable = 3,
  Iterable = 4,
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
  value = 3,
}

export enum Attribute {
  varName = 1,
  firstAttributeName = 2,
}

export enum BinaryOperator {
  Left = 1,
  Right = 2,
}

export enum Call {
  FuncRef = 1,
  Args = 2,
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
