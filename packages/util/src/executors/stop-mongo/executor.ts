import { StopMongoExecutorSchema } from './schema';
import {
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';
import { exec, getMongoDockerComposePath } from '../../shared/util';
import { logger } from 'nx/src/utils/logger';

export default async function runExecutor(
  options: StopMongoExecutorSchema
): Promise<ExecutorReturnValue> {
  const { containerName } = options;

  const dockerComposePath = getMongoDockerComposePath();

  const command = [
    'docker compose',
    `-f "${dockerComposePath}"`,
    `-p ${containerName}`,
    'down',
  ].join(' ');

  logger.info('Executing command:');
  logger.info(command);

  const outputs = await exec(command);
  processExecutorConsoleOutputs(outputs);
  return { success: true };
}
