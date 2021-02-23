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
    const assignment: Calcium.Command.Assignment = {
      indent: 1,
      keyword: Calcium.Keyword.Command.Assignment,
      lhs: {
        kind: Calcium.Keyword.Reference.Variable,
        content: {
          name: 'x'
        }
      },
      rhs: {
        kind: Calcium.Keyword.Expression.Int,
        content: 7
      },
    };
    const engine = new Calcium.Engine([assignment]);
    expect(engine.currentIndex).toBe(0);
    expect(engine.step().status).toBe(Calcium.Status.Running);
    expect(engine.env.context.lookUp('x')).toBe(7);
  });
});
