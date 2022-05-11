import { PostgresStartExecutorSchema } from './schema';
import executor from './executor';

const options: PostgresStartExecutorSchema = {};

describe('PostgresStart Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});