export type BasicTypes = number | string | boolean | null;

export type ListType = SomeType[];

export interface DictType {
  [key: string]: SomeType;
}

export type SomeType = BasicTypes | ListType | DictType;

export function isDict(value: any): boolean {
  return typeof value !== 'number'
  && typeof value !== 'string'
  && typeof value !== 'boolean'
  && value !== null
  && value !instanceof Array;
  // TODO: add FuncObj, ClassObj, Instance, ...
}
