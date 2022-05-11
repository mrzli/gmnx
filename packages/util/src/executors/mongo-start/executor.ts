import { MongoStartExecutorSchema } from './schema';
import {
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';
import { logger } from 'nx/src/utils/logger';
import { exec, getMongoDockerComposePath } from '../../shared/util';

export default async function runExecutor(
  options: MongoStartExecutorSchema
): Promise<ExecutorReturnValue> {
  const { containerName, mongoVersion, port, dataDir } = options;

  const dockerComposePath = getMongoDockerComposePath();

  const command = [
    `MONGO_VERSION=${mongoVersion}`,
    `MONGO_PORT=${port}`,
    `MONGO_DATA_DIR=${dataDir}`,
    'docker compose',
    `-f "${dockerComposePath}"`,
    `-p ${containerName}`,
    'up',
    '-d',
  ].join(' ');

  logger.info('Executing command:');
  logger.info(command);

  const outputs = await exec(command);
  processExecutorConsoleOutputs(outputs);
  return { success: true };
}
