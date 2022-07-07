import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from './schema';
import { generateWeb } from './impl/web';
import { generateSharedLib } from './impl/shared-lib';
import { generateBackend } from './impl/backend';
import { generateCli } from './impl/cli';
import { generateDataModel } from './impl/data-model';
import { generatePostmanCollection } from './impl/postman';
import { installPackages } from './impl/packages';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  await installPackages(tree);
  await generateDataModel(tree, options);
  await generateSharedLib(tree, options);
  await generateWeb(tree, options);
  await generateBackend(tree, options);
  await generateCli(tree, options);
  await generatePostmanCollection(tree, options);
}

export default generateProject;
