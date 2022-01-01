import * as Err from "../error";
import { InternalType } from "../expression";
import Environment from "../runtime/environment";
import { default as Sym } from "../symbol";

/**
 * represent `None` object
 */
const None = new Proxy(
  {},
  {
    get(target, property, receiver) {
      if (property === Sym.description) return "None";
      else if (property === Sym.evaluate) return (env: Environment) => None;
      else if (property === Sym.value) return null;
      else throw new Err.AttributeNotFound(property.toString());
    },
  }
) as InternalType;

export default None;
