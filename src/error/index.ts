export class AttributeNotFound extends Error {
  constructor(public readonly key: string) {
    super(`attribute ${key} not found.`);
    this.key = key;
  }
}

export class CannotApplySubscript extends Error {}
export class CannotConvertToExpression extends Error {}

export class CannotInherit extends Error {
  constructor(public readonly name: string) {
    super(`cannot inherit ${name}.`);
    this.name = name;
  }
}

export class CommandNotFound extends Error {}
export class FewerElement extends Error {}
export class FunctionCalled extends Error {}
export class InconsistentBlock extends Error {}
export class IndexMustBeInt extends Error {}
export class InvalidRange extends Error {}
export class KeyMustBeStrOrInt extends Error {}
export class ListIsEmpty extends Error {}

export class NameNotFound extends Error {
  constructor(public readonly name: string) {
    super(`${name} not found.`);
    this.name = name;
  }
}

export class NotIterable extends Error {}
export class OperationFailed extends Error {}
export class SliceNotSupported extends Error {}
export class SuperIsFailed extends Error {}

export class UnsupportedKeyword extends Error {
  constructor(public readonly keyword: string) {
    super(`${keyword} is not supported.`);
    this.keyword = keyword;
  }
}
