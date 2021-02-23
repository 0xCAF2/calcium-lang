export type BasicType = number | string | boolean | null;

export type ListType = Array<BasicType | ListType>;

type DictType = {};

export type Type = BasicType | ListType | DictType;
