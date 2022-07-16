import { ApplicationGeneratorOptions as NestAppSchema } from '@nrwl/nest/src/generators/application/schema';
import { applicationGenerator as generateNestApp } from '@nrwl/nest/src/generators/application/application';
import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';

export async function generateNest(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  // @nrwl/nest:application
  const nestAppSchema: NestAppSchema = {
    name: options.projects.backend.projectBaseName,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:app`,
    frontendProject: options.projects.web.projectBaseName,
  };
  await generateNestApp(tree, nestAppSchema);
}
