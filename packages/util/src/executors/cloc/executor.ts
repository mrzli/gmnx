import child_process from 'child_process';
import { promisify } from 'util';
import { ClocExecutorSchema } from './schema';
import {
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';

const exec = promisify(child_process.exec);

export default async function runExecutor(
  options: ClocExecutorSchema
): Promise<ExecutorReturnValue> {
  const { ignoreDirs, ignoreFiles } = options;

  const command: string = [
    'npx',
    'cloc',
    ignoreDirs.length > 0 ? `--exclude-dir=${ignoreDirs.join(',')}` : undefined,
    ignoreFiles.length > 0
      ? `--not-match-f=${ignoreFiles.join(',')}`
      : undefined,
    '.',
  ]
    .filter((part) => part !== undefined)
    .join(' ');

  const outputs = await exec(command);
  processExecutorConsoleOutputs(outputs);
  return { success: !outputs.stderr };
}
