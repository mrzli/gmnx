import { PublishAllExecutorSchema } from './schema';
import executor from './executor';

const options: PublishAllExecutorSchema = {};

describe.skip('PublishAll Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
