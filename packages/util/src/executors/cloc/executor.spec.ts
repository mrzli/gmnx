import { ClocExecutorSchema } from './schema';
import executor from './executor';

const options: ClocExecutorSchema = {
  ignoreDirs: [],
  ignoreFiles: [],
};

describe.skip('Cloc Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
