import { Tree } from '@nrwl/devkit';
import path from 'path';
import { NormalizedSchema } from '../../shared/util';

export async function cleanProject(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const projectRoot = options.projects.sharedLib.projectRoot;
  tree.delete(path.join(projectRoot, 'src/lib'));
  tree.write(path.join(projectRoot, 'src/index.ts'), '');
}
