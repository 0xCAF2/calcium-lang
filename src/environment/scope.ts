import { Type } from "../type";

export interface Scope {
  lookUp(key: string): Type | undefined;
  register(key: string, value: Type): void;
}

export class GlobalScope implements Scope {
  dict: Map<string, Type>;
  constructor() {
    this.dict = new Map<string, Type>();
  }
  lookUp(key: string): Type | undefined {
    return this.dict.get(key);
  }
  register(key: string, value: Type): void {
    this.dict.set(key, value);
  }
}
