import * as child_process from 'child_process';
import { promisify } from 'util';
import { Tree } from '@nrwl/devkit';
import { FsTree } from 'nx/src/generators/tree';

export function createWorkspaceTree(): Tree {
  return new FsTree('.', false);
}

export async function exec(command: string): Promise<string> {
  const execAsync = promisify(child_process.exec);
  const { stdout, stderr } = await execAsync(command);
  invariant(stderr.length === 0, stderr);
  return stdout;
}

export function createFindByFileNameCommand(
  libsDir: string,
  fileName: string
): string {
  return ['find', `./${libsDir}`, '-type f', `-name ${fileName}`].join(' ');
}

export function findFilesResultToArray(
  findFilesResult: string
): readonly string[] {
  return findFilesResult
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line);
}

export function invariant(
  condition: boolean,
  message: string
): asserts condition {
  if (!condition) {
    console.error(message);
    process.exit(1);
  }
}
