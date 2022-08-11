import { PostgresStartExecutorSchema } from './schema';
import { getPostgresDockerComposePath } from '../../shared/util';
import { logger } from 'nx/src/utils/logger';
import {
  execCommand,
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';

export default async function runExecutor(
  options: PostgresStartExecutorSchema
): Promise<ExecutorReturnValue> {
  const {
    containerName,
    postgresVersion,
    port,
    dataDir,
    dbName,
    username,
    password,
  } = options;

  const dockerComposePath = getPostgresDockerComposePath();

  const command = [
    `POSTGRES_VERSION=${postgresVersion}`,
    `POSTGRES_PORT=${port}`,
    `POSTGRES_DATA_DIR=${dataDir}`,
    `POSTGRES_DB=${dbName}`,
    `POSTGRES_USERNAME=${username}`,
    `POSTGRES_PASSWORD=${password}`,
    'docker compose',
    `-f "${dockerComposePath}"`,
    `-p ${containerName}`,
    'up',
    '-d',
  ].join(' ');

  logger.info('Executing command:');
  logger.info(command);

  const outputs = await execCommand(command);
  processExecutorConsoleOutputs(outputs);
  return { success: true };
}
