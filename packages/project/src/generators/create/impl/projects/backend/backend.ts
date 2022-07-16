import { Tree } from '@nrwl/devkit';
import { generateNest } from './nest';
import { generateModules } from './modules';
import { generateMongoDatabase } from './mongo-database';
import { NormalizedSchema } from '../../shared/util';

export async function generateBackend(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  await generateNest(tree, options);
  await generateMongoDatabase(tree, options);
  await generateModules(tree, options);
}
