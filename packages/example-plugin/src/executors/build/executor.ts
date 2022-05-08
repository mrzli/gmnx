import { BuildExecutorSchema } from './schema';
import { ExecutorReturnValue } from '@gmnx/internal-util';

export default async function runExecutor(
  options: BuildExecutorSchema
): Promise<ExecutorReturnValue> {
  console.log('Executor ran for Build', options);
  return {
    success: true,
  };
}
