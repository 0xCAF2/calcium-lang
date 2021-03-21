export enum BinaryOperator {
  Addition = '+',
  Subtraction = '-',
  Multiplication = '*',
  Exponentiation = '**',
  Division = '/',
  FloorDivision = '//',
  Remainder = '%',

  Equal = '==',
  NotEqual = '!=',
  LessThan = '<',
  LessThanOrEqual = '<=',
  GreaterThan = '>',
  GreaterThanOrEqual = '>=',

  And = 'and',
  Or = 'or',
  Is = 'is',
  IsNot = 'is not',
  In = 'in',
  NotIn = 'not in',

  BitwiseAnd = '&',
  BitwiseOr = '|',
  BitwiseXor = '^',
  LeftShift = '<<',
  RightShift = '>>',
}

export enum Command {
  Assignment = "=",
  Break = 'break',
  Call = 'call',
  ClassDef = 'class',
  Comment = '#',
  CompoundAddition = '+=',
  CompoundSubtraction = '-=',
  CompoundMultiplication = '*=',
  Continue = 'continue',
  Elif = 'elif',
  Else = 'else',
  EndOfCode = 'end',
  Except = 'except',
  ForEach = 'foreach',
  ForRange = 'forrange',
  FuncDef = 'def',
  If = 'if',
  IfBlock = 'ifblock',
  Import = 'import',
  Pass = 'pass',
  Raise = 'raise',
  Return = 'return',
  Try = 'try',
  While = 'while',
}

export enum BuiltinType {
  Int = 'int',
  Str = 'str',
  Bool = 'bool',
  None = 'none',
  List = 'list',
  Dict = 'dict',
}

export enum Reference {
  Attribute = 'attr',
  Subscript = 'sub',
  Variable = 'var',
}

export enum UnaryOperator {
  BitwiseNot = '~',
  Negative = '-_',
  Not = 'not',
}
