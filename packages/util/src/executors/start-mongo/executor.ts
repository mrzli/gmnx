import { StartMongoExecutorSchema } from './schema';
import {
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';
import { logger } from 'nx/src/utils/logger';
import { exec, getMongoDockerComposePath } from '../../shared/util';

export default async function runExecutor(
  options: StartMongoExecutorSchema
): Promise<ExecutorReturnValue> {
  const { containerName } = options;

  const dockerComposePath = getMongoDockerComposePath();

  const command = [
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
