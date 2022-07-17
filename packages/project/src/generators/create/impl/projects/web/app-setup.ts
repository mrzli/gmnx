import { NormalizedSchema, pathRelativeToFiles } from '../../shared/util';
import { generateFiles, Tree } from '@nrwl/devkit';

export async function generateAppSetup(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const projectRoot = options.projects.web.projectRoot;

  generateFiles(tree, pathRelativeToFiles('web/app-setup'), projectRoot, {
    template: '',
    moduleNameReactUtil: options.libModuleNames.reactUtil,
  });
}
