import { MongoStartExecutorSchema } from './schema';
import executor from './executor';

const options: MongoStartExecutorSchema = {
  containerName: 'mongo',
  mongoVersion: '5.0.8',
  port: 27017,
  dataDir: '~/docker/mongo',
};

describe.skip('StartMongo Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
