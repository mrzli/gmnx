import { addProjectConfiguration, Tree } from '@nrwl/devkit';
import { WorkspaceProjectGeneratorSchema } from './schema';
import { getProjectConfiguration } from './src/project-configuration';
import { getProjectValues } from '@gmnx/internal-util';

export interface NormalizedSchema extends WorkspaceProjectGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
}

export async function generateWorkspaceProject(
  tree: Tree,
  options: WorkspaceProjectGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfiguration = getProjectConfiguration(
    normalizedOptions.projectName,
    normalizedOptions.projectRoot
  );

  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfiguration
  );
}

function normalizeOptions(
  tree: Tree,
  options: WorkspaceProjectGeneratorSchema
): NormalizedSchema {
  const projectValues = getProjectValues(tree, options, false);

  return {
    ...options,
    ...projectValues,
  };
}

export default generateWorkspaceProject;
