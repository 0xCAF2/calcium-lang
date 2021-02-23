import Calcium from '../src/main';

describe('test', () => {
  it('Calcium has an Engine object.', () => {
    expect(Calcium).toHaveProperty('Engine');
  });
  it('Engine can call step() method.', () => {
    const engine = new Calcium.Engine([]);
    expect(engine.currentIndex).toBe(0);
    expect(engine.step().status).toBe(Calcium.Status.Running);
  });
  it('Some keywords and indexes are declared.', () => {
    expect(Calcium.Keyword).toBeDefined();
    expect(Calcium.Keyword.Reference).toBeDefined();
    expect(Calcium.Keyword.Reference.Variable).toBe('var');
    expect(Calcium.Index.Assignment.Lhs).toBe(3);
  });
  it('A Assignment command can be created and run.', () => {
    const assignment: Calcium.Command.Assignment = {
      indent: 1,
      keyword: Calcium.Keyword.Command.Assignment,
      lhs: {
        name: 'x',
      },
      rhs: 7,
    };
    const engine = new Calcium.Engine(assignment);
    expect(engine.run().status).toBe(Calcium.Status.Running);
  });
});
