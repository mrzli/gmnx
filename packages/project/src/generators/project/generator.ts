import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from './schema';
import { generateWeb } from './impl/projects/web/web';
import { generateSharedLib } from './impl/projects/shared-lib/shared-lib';
import { generateBackend } from './impl/projects/backend/backend';
import { generateCli } from './impl/projects/cli/cli';
import { generateDataModel } from './impl/projects/data-model/data-model';
import { generatePostmanCollection } from './impl/other/postman';
import { setupWorkspace } from './impl/other/workspace';
import { finalization } from './impl/other/finalization';
import { normalizeOptions } from './impl/shared/util';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // const dryRun = process.argv.includes('--dry-run');

  const normalizedOptions = normalizeOptions(tree, options);

  await setupWorkspace(tree, normalizedOptions);
  await generateDataModel(tree, normalizedOptions);
  await generateSharedLib(tree, normalizedOptions);
  await generateWeb(tree, normalizedOptions);
  await generateBackend(tree, normalizedOptions);
  await generateCli(tree, normalizedOptions);
  await generatePostmanCollection(tree, normalizedOptions);
  await finalization(tree);
}

export default generateProject;
