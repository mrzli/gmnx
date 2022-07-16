import { Tree } from '@nrwl/devkit';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { Linter } from '@nrwl/linter';
import { applicationGenerator } from '@nrwl/react/src/generators/application/application';
import { NormalizedSchema } from '../../shared/util';

export async function generateReact(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  // @nrwl/react:application
  const reactAppSchema: ReactAppSchema = {
    name: options.projects.web.projectBaseName,
    directory: options.directory,
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'scss',
    e2eTestRunner: 'none',
    unitTestRunner: 'jest',
    tags: `app:${options.name},scope:web,type:app`,
  };
  await applicationGenerator(tree, reactAppSchema);
}
