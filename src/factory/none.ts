class NoneType {
  get description(): string {
    return "None";
  }
}

const None = new NoneType();

export { None, NoneType };
