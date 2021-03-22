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
  it('An assignment command can be created and run.', () => {
    const code: Calcium.Command.Line[] = [
      {"indent": 1, "keyword": "#", "version": "0.1.0"},
      {"indent": 1, "keyword": "=", "lhs": {"kind": "var", "name": "x"}, "rhs": 7},
      {"indent": 1, "keyword": "=", "lhs": {"kind": "var", "name": "y"}, "rhs": {"kind": "var", "name": "x"}},
      {"indent": 1, "keyword": "=", "lhs": {"kind": "var", "name": "z"}, "rhs": [{"kind": "var", "name": "x"}, {"kind": "var", "name": "x"}, 73]},
      {"indent": 1, "keyword": "=", "lhs": {"kind": "sub", "container": {"kind": "var", "name": "z"}, "indexOrKey": 0}, "rhs": 5},
      {"indent": 1, "keyword": "end"}
    ];
    const engine = new Calcium.Engine(code);
    expect(engine.currentIndex).toBe(0);
    expect(engine.run().status).toBe(Calcium.Status.Terminated);
    expect(engine.env.context.lookUp('x')).toBe(7);
    expect(engine.env.context.lookUp('y')).toBe(7);
    expect(engine.env.context.lookUp('z')).toEqual([5, 7, 73]);
  });
});
