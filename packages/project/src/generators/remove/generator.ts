import { Tree } from '@nrwl/devkit';
import { getProjectName } from '@gmnx/internal-util';
import { RemoveGeneratorSchema } from './schema';
import { Schema as RemoveSchema } from '@nrwl/workspace/src/generators/remove/schema';
import { ALL_PROJECT_SUFFIXES } from '../../shared/constants';
import { removeGenerator } from '@nrwl/workspace';
import { cleanWorkspace } from './impl/workspace';

export async function generateRemove(
  tree: Tree,
  options: RemoveGeneratorSchema
): Promise<void> {
  for (const projectSuffix of ALL_PROJECT_SUFFIXES) {
    const removeOptions = createRemoveOptions(tree, options, projectSuffix);
    await removeGenerator(tree, removeOptions);
  }
  await cleanWorkspace(tree, options);
}

function createRemoveOptions(
  tree: Tree,
  options: RemoveGeneratorSchema,
  projectSuffix: string
): RemoveSchema {
  return {
    projectName: getProjectName(tree, options, projectSuffix),
    forceRemove: true,
    skipFormat: true,
  };
}

export default generateRemove;
