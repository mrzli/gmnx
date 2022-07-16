import { Tree } from '@nrwl/devkit';
import { Schema } from '@nrwl/node/src/generators/application/schema';
import { applicationGenerator } from '@nrwl/node/src/generators/application/application';
import { NormalizedSchema } from '../../shared/util';

export async function generateNode(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  // @nrwl/node:application
  const nodeAppSchema: Schema = {
    name: options.projects.cli.projectBaseName,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:app`,
  };
  await applicationGenerator(tree, nodeAppSchema);
}
