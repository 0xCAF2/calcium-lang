import { SomeType } from "../type";

export interface Scope {
  lookUp(key: string): SomeType | undefined;
  register(key: string, value: SomeType): void;
}

export class GlobalScope implements Scope {
  dict: Map<string, SomeType>;
  constructor() {
    this.dict = new Map<string, SomeType>();
  }
  lookUp(key: string): SomeType | undefined {
    return this.dict.get(key);
  }
  register(key: string, value: SomeType): void {
    this.dict.set(key, value);
  }
}
