import * as child_process from 'child_process';
import { promisify } from 'util';

export async function exec(command: string): Promise<string> {
  const execAsync = promisify(child_process.exec);
  const { stdout, stderr } = await execAsync(command);
  if (stderr.length > 0) {
    throw new Error(stderr);
  }

  return stdout;
}

export function createFindByFileNameCommand(fileName: string): string {
  return `find ./packages -type f -name ${fileName}`;
}

export function findFilesResultToArray(
  findFilesResult: string
): readonly string[] {
  return findFilesResult
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line);
}
