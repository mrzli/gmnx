import { MongoStopExecutorSchema } from './schema';
import {
  execCommand,
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';
import { getMongoDockerComposePath } from '../../shared/util';
import { logger } from 'nx/src/utils/logger';

export default async function runExecutor(
  options: MongoStopExecutorSchema
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
    'down',
  ].join(' ');

  logger.info('Executing command:');
  logger.info(command);

  const outputs = await execCommand(command);
  processExecutorConsoleOutputs(outputs);
  return { success: true };
}
