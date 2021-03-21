export type BasicTypes = number | string | boolean | null;

export type ListType = BuiltinTypes[];

export type DictType = {};

export type BuiltinTypes = BasicTypes | ListType | DictType;
