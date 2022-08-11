import { PostgresStartExecutorSchema } from './schema';
import executor from './executor';

const options: PostgresStartExecutorSchema = {
  containerName: 'postgres',
  postgresVersion: '14.2',
  port: 15432,
  dataDir: '~/docker/postgres',
  dbName: 'postgres',
  username: 'postgres',
  password: 'password',
};

describe.skip('PostgresStart Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
