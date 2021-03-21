import { BuiltinTypes } from "../type";

export interface Scope {
  lookUp(key: string): BuiltinTypes | undefined;
  register(key: string, value: BuiltinTypes): void;
}

export class GlobalScope implements Scope {
  dict: Map<string, BuiltinTypes>;
  constructor() {
    this.dict = new Map<string, BuiltinTypes>();
  }
  lookUp(key: string): BuiltinTypes | undefined {
    return this.dict.get(key);
  }
  register(key: string, value: BuiltinTypes): void {
    this.dict.set(key, value);
  }
}
