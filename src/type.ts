export type BasicTypes = number | string | boolean | null;

export type ListType = SomeType[];

export type DictType = {};

export type SomeType = BasicTypes | ListType | DictType;
