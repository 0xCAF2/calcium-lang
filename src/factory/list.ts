export default function createList(value: any) {
  return new Proxy(value, {});
}
