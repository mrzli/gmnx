import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import { generateInitialDataModel } from './initial-data-model';
import { generateSchemas } from './schemas';

export async function generateDataModel(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  await generateInitialDataModel(tree, options);
  await generateSchemas(tree, options);
}
