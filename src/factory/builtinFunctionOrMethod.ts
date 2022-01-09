import { InternalType } from "../type";

const builtinFunctionOrMethod = new Proxy({}, {}) as InternalType;

export default builtinFunctionOrMethod;
