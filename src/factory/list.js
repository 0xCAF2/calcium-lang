export default function createList(value) {
  return new Proxy(value, {});
}
