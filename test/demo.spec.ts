import Calcium from '../src';

describe('test', () => {
  it('Can get Calcium object', () => {
    expect(Calcium).toHaveProperty('Engine');
  });
  it('Engine can call step() method.', () => {
    const engine = new Calcium.Engine();
    expect(engine.step().status).toBe(Calcium.Status.Running);
  });
});
