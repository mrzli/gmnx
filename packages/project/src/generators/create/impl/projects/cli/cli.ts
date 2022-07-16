import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import { generateNode } from './node';
import { generateCliCode } from './code';

export async function generateCli(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  await generateNode(tree, options);
  await generateCliCode(tree, options);
}
