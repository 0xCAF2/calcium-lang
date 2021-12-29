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
  Assignment = "=",
  Break = "break",
  Call = "call",
  ClassDef = "class",
  Comment = "#",
  CompoundAddition = "+=",
  CompoundSubtraction = "-=",
  CompoundMultiplication = "*=",
  Continue = "continue",
  Elif = "elif",
  Else = "else",
  EndOfCode = "end",
  Except = "except",
  For = "for",
  FuncDef = "def",
  If = "if",
  Import = "import",
  Pass = "pass",
  Raise = "raise",
  Return = "return",
  Try = "try",
  While = "while",
}

export enum Reference {
  Attribute = "attr",
  Subscript = "sub",
  Variable = "var",
}

export enum UnaryOperator {
  BitwiseNot = "~",
  Negative = "-_",
  Not = "not",
}
