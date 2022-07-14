import { ClocExecutorSchema } from './schema';
import {
  execCommand,
  ExecutorReturnValue,
  processExecutorConsoleOutputs,
} from '@gmnx/internal-util';
import { filterOutNullish } from '@gmjs/util';

export default async function runExecutor(
  options: ClocExecutorSchema
): Promise<ExecutorReturnValue> {
  const { ignoreDirs, ignoreFiles } = options;

  const command: string = filterOutNullish([
    'npx',
    'cloc',
    ignoreDirs.length > 0 ? `--exclude-dir=${ignoreDirs.join(',')}` : undefined,
    ignoreFiles.length > 0
      ? `--not-match-f=${ignoreFiles.join(',')}`
      : undefined,
    '.',
  ]).join(' ');

  const outputs = await execCommand(command);
  processExecutorConsoleOutputs(outputs);
  return { success: !outputs.stderr };
}
