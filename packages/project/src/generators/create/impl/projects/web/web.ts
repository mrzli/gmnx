import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import { generateReact } from './react';
import { cleanProject } from './clean-project';
import { setupTailwind } from './tailwind';
import { generateBackendApi } from './backend-api';
import { generateAppSetup } from './app-setup';

export async function generateWeb(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  await generateReact(tree, options);
  await cleanProject(tree, options);
  await setupTailwind(tree, options);
  await generateBackendApi(tree, options);
  await generateAppSetup(tree, options);
}
