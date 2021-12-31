import { default as Sym } from "../symbol";

export default function createBuiltinFunc(name, body) {
  return new Proxy({}, {
    get(target, property) {
      if (property === Sym.name) return name;
      else if (property === Sym.body) return body;
      else if (property === Sym.call) return (args, env) => body(args, env);
      else if (property === Sym.evaluate) return (_) => this;
      else return target[property];
    }
  });
}
