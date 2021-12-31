import { default as Sym } from '../symbol'

export default function createStr(value) {
  const self = new Proxy({}, {
    get(target, property) {
      if (property === Sym.description) return value;
      else if (property === Sym.value) return value;
      else if (property === Sym.evaluate) return (_) => self;
      else return target[property];
    },
  });
  return self;
}
