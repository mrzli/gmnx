import * as child_process from 'child_process';
import { promisify } from 'util';
import { ClocExecutorSchema } from './schema';

const exec = promisify(child_process.exec);

export default async function runExecutor(
  options: ClocExecutorSchema
): Promise<{ success: boolean }> {
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

  const { stdout, stderr } = await exec(command);

  console.log(stdout);
  if (stderr.length > 0) {
    console.error(stderr);
  }

  const success = !stderr;
  return { success };
}
