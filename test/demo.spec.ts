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
});
