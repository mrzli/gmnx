import { ClocExecutorSchema } from './schema';
import {
  execCommand,
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';

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

  const outputs = await execCommand(command);
  processExecutorConsoleOutputs(outputs);
  return { success: !outputs.stderr };
}
