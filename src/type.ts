export type BasicType = number | string | boolean | null;

type ListType = Array<BasicType | ListType>;

type DictType = {};

type Type = BasicType | ListType | DictType;

export default Type;
