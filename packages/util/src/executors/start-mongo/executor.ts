import * as child_process from 'child_process';
import * as path from 'path';
import { StartMongoExecutorSchema } from './schema';
import { promisify } from 'util';
import { ExecutorReturnValue } from '@gmnx/internal-util';

const exec = promisify(child_process.exec);

export default async function runExecutor(
  options: StartMongoExecutorSchema
): Promise<ExecutorReturnValue> {
  // const dockerComposePath = path.join(
  //   __dirname,
  //   'config',
  //   'docker-compose.mongo.yaml'
  // );
  //
  // const command = [
  //   'docker compose',
  //   `-f "${dockerComposePath}"`,
  //   `-p mongo`,
  //   'up',
  //   '-d',
  // ].join(' ');

  console.log('Executor ran for StartMongo', options);
  return {
    success: true,
  };
}
