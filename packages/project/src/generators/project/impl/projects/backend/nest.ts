import { ApplicationGeneratorOptions as NestAppSchema } from '@nrwl/nest/src/generators/application/schema';
import {
  PROJECT_SUFFIX_APP_BACKEND,
  PROJECT_SUFFIX_APP_WEB,
} from '../../../../../shared/constants';
import { applicationGenerator as generateNestApp } from '@nrwl/nest/src/generators/application/application';
import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';

export async function generateNest(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  // @nrwl/nest:application
  const nestAppSchema: NestAppSchema = {
    name: options.name + PROJECT_SUFFIX_APP_BACKEND,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:app`,
    frontendProject: options.name + PROJECT_SUFFIX_APP_WEB,
  };
  await generateNestApp(tree, nestAppSchema);
}
