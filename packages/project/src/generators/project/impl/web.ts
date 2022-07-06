import { formatFiles, generateFiles, Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../schema';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { PROJECT_SUFFIX_APP_WEB } from '../../../shared/constants';
import { Linter } from '@nrwl/linter';
import { applicationGenerator as generateReactApp } from '@nrwl/react/src/generators/application/application';
import { getProjectRoot } from '@gmnx/internal-util';
import path from 'path';

export async function generateWeb(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // @nrwl/react:application
  const reactAppSchema: ReactAppSchema = {
    name: options.name + PROJECT_SUFFIX_APP_WEB,
    directory: options.directory,
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'scss',
    e2eTestRunner: 'none',
    unitTestRunner: 'jest',
    tags: `app:${options.name},scope:web,type:app`,
  };
  await generateReactApp(tree, reactAppSchema);

  cleanProject(tree, reactAppSchema);

  addFiles(tree, reactAppSchema);
  await formatFiles(tree);
}

function cleanProject(tree: Tree, options: ReactAppSchema): void {
  const projectRoot = getProjectRoot(tree, options, true, undefined);
  tree.delete(path.join(projectRoot, 'src/main.tsx'));
  tree.delete(path.join(projectRoot, 'src/app'));
}

function addFiles(tree: Tree, options: ReactAppSchema): void {
  const projectRoot = getProjectRoot(tree, options, true, undefined);
  generateFiles(tree, path.join(__dirname, '../files/web'), projectRoot, {
    template: '',
  });
}
