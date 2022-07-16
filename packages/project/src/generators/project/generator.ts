import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from './schema';
import { generateWeb } from './impl/projects/web';
import { generateSharedLib } from './impl/projects/shared-lib';
import { generateBackend } from './impl/projects/backend';
import { generateCli } from './impl/projects/cli';
import { generateDataModel } from './impl/projects/data-model';
import { generatePostmanCollection } from './impl/other/postman';
import { setupWorkspace } from './impl/other/workspace';
import { finalization } from './impl/other/finalization';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // const dryRun = process.argv.includes('--dry-run');

  await setupWorkspace(tree, options);
  await generateDataModel(tree, options);
  await generateSharedLib(tree, options);
  await generateWeb(tree, options);
  await generateBackend(tree, options);
  await generateCli(tree, options);
  await generatePostmanCollection(tree, options);
  await finalization(tree);
}

export default generateProject;
