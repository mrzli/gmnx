import { MongoStartExecutorSchema } from './schema';
import executor from './executor';

const options: MongoStartExecutorSchema = {};

describe('StartMongo Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
