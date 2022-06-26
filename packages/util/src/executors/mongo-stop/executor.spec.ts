import { MongoStopExecutorSchema } from './schema';
import executor from './executor';

const options: MongoStopExecutorSchema = {
  containerName: 'mongo',
  mongoVersion: '5.0.8',
  port: 27017,
  dataDir: '~/docker/mongo',
};

describe.skip('StopMongo Executor', () => {
  it('can run', async () => {
    const output = await executor(options);
    expect(output.success).toBe(true);
  });
});
