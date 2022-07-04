import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../schema';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { PROJECT_SUFFIX_APP_WEB } from '../../../shared/constants';
import { Linter } from '@nrwl/linter';
import { applicationGenerator as generateReactApp } from '@nrwl/react/src/generators/application/application';

export async function generateFrontend(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // @nrwl/react:application
  const reactAppSchema: ReactAppSchema = {
    name: options.name + PROJECT_SUFFIX_APP_WEB,
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'scss',
    e2eTestRunner: 'none',
    unitTestRunner: 'jest',
    tags: `app:${options.name},scope:web,type:app`,
  };
  await generateReactApp(tree, reactAppSchema);
}
