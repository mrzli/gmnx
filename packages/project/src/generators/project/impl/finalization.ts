import { formatFiles, Tree } from '@nrwl/devkit';

export async function finalization(tree: Tree): Promise<void> {
  await formatFiles(tree);
}
