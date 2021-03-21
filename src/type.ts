export type BasicTypes = number | string | boolean | null;

export type ListType = AllTypes[];

export type DictType = {};

export type AllTypes = BasicTypes | ListType | DictType;
