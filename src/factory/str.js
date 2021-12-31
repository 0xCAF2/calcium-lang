import { default as Sym } from '../symbol'

export default function createStr(value) {
  return new Proxy({}, {
    get(target, property) {
      if (property === Sym.description) return value;
      else if (property === Sym.value) return value;
      else return target[property];
    },
  });
}
