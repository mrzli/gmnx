import { MongoStopExecutorSchema } from './schema';
import executor from './executor';

const options: MongoStopExecutorSchema = {};

describe('StopMongo Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
