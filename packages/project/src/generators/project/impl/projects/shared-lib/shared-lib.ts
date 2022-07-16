import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import { cleanProject } from './clean-project';
import { generateLibrary } from './library';
import { generateSharedLibCode } from './code';

export async function generateSharedLib(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  await generateLibrary(tree, options);
  await cleanProject(tree, options);
  await generateSharedLibCode(tree, options);
}
