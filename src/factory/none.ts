import * as Err from "../error";
import { default as Sym } from "../symbol";

const None = new Proxy(
  {},
  {
    get(target, property, receiver) {
      if (property === Sym.description) return "None";
      else throw new Err.AttributeNotFound(property.toString());
    },
  }
);

export default None;
