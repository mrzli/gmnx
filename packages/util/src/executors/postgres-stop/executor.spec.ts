import { PostgresStopExecutorSchema } from './schema';
import executor from './executor';

const options: PostgresStopExecutorSchema = {};

describe('PostgresStop Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});