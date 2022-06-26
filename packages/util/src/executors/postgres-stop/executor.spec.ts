import { PostgresStopExecutorSchema } from './schema';
import executor from './executor';

const options: PostgresStopExecutorSchema = {
  containerName: 'postgres',
  postgresVersion: '14.2',
  port: 15432,
  dataDir: '~/docker/postgres',
  username: 'postgres',
  password: 'password',
};

describe.skip('PostgresStop Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
