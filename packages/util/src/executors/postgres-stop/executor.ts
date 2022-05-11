import { PostgresStopExecutorSchema } from './schema';
import {
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';
import { exec, getPostgresDockerComposePath } from '../../shared/util';
import { logger } from 'nx/src/utils/logger';

export default async function runExecutor(
  options: PostgresStopExecutorSchema
): Promise<ExecutorReturnValue> {
  const { containerName, postgresVersion, port, dataDir, username, password } =
    options;

  const dockerComposePath = getPostgresDockerComposePath();

  const command = [
    `POSTGRES_VERSION=${postgresVersion}`,
    `POSTGRES_PORT=${port}`,
    `POSTGRES_DATA_DIR=${dataDir}`,
    `POSTGRES_USERNAME=${username}`,
    `POSTGRES_PASSWORD=${password}`,
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
