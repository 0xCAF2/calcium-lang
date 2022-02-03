export enum BinaryOperator {
  Addition = "+",
  Subtraction = "-",
  Multiplication = "*",
  Exponentiation = "**",
  Division = "/",
  FloorDivision = "//",
  Remainder = "%",

  Equal = "==",
  NotEqual = "!=",
  GreaterThan = ">",
  GreaterThanOrEqual = ">=",
  LessThan = "<",
  LessThanOrEqual = "<=",

  And = "and",
  Or = "or",
  Is = "is",
  IsNot = "is not",
  In = "in",
  NotIn = "not in",

  BitwiseAnd = "&",
  BitwiseOr = "|",
  BitwiseXor = "^",
  LeftShift = "<<",
  RightShift = ">>",
}

export enum Command {
  Assign = "=",
  Break = "break",
  Class = "class",
  Comment = "#",
  CompoundAddition = "+=",
  CompoundSubtraction = "-=",
  CompoundMultiplication = "*=",
  Continue = "continue",
  Def = "def",
  Elif = "elif",
  Else = "else",
  End = "end",
  Except = "except",
  Expression = "expr",
  For = "for",
  If = "if",
  Ifs = "ifs",
  Import = "import",
  Pass = "pass",
  Raise = "raise",
  Return = "return",
  Try = "try",
  While = "while",
}

export enum Reference {
  Attribute = "attr",
  Call = "call",
  Subscript = "sub",
  Variable = "var",
}

export enum Syntax {
  Comma = ",",
  KwArg = "kwarg",
}

export enum UnaryOperator {
  BitwiseNot = "~",
  Negative = "-_",
  Not = "not",
}
