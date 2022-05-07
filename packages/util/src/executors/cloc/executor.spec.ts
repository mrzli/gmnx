import { ClocExecutorSchema } from './schema';
import executor from './executor';

const options: ClocExecutorSchema = {};

describe('Cloc Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
