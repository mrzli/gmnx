import { generateFiles, Tree } from '@nrwl/devkit';
import { deleteFiles } from '@gmnx/internal-util';
import path from 'path';
import { NormalizedSchema, pathRelativeToFilesDir } from '../../shared/util';

export async function cleanProject(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const projectRoot = options.projects.web.projectRoot;
  deleteFiles(
    tree,
    ['src/main.tsx', 'src/app'].map((p) => path.join(projectRoot, p))
  );

  generateFiles(tree, pathRelativeToFilesDir('web/clean'), projectRoot, {
    template: '',
  });
}
