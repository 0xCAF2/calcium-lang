import Calcium from '../src';

describe('test', () => {
  it('Calcium has an Engine object.', () => {
    expect(Calcium).toHaveProperty('Engine');
  });
  it('Some keywords and indexes are declared.', () => {
    expect(Calcium.Keyword).toBeDefined();
    expect(Calcium.Keyword.Reference).toBeDefined();
    expect(Calcium.Keyword.Reference.Variable).toBe('var');
  });
  it('A Assignment command can be created and run.', () => {
    const code: Calcium.Command[] = [
      {"indent": 1, "keyword": "#", "version": "0.1.0"},
      {"indent": 1, "keyword": "=", "lhs": {"kind": "var", "content": {"name": "x"}}, "rhs": 7},
      {"indent": 1, "keyword": "=", "lhs": {"kind": "var", "content": {"name": "y"}}, "rhs": {"kind": "var", "content": {"name": "x"}}},
      {"indent": 1, "keyword": "end"}
    ];
    const engine = new Calcium.Engine(code);
    expect(engine.currentIndex).toBe(0);
    expect(engine.run().status).toBe(Calcium.Status.Terminated);
    expect(engine.env.context.lookUp('x')).toBe(7);
    expect(engine.env.context.lookUp('y')).toBe(7);
  });
});
