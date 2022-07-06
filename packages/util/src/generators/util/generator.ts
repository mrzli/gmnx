import {
  addProjectConfiguration,
  getWorkspaceLayout,
  names,
  Tree,
} from '@nrwl/devkit';
import { UtilGeneratorSchema } from './schema';
import { getProjectConfiguration } from './src/project-configuration';

export interface NormalizedSchema extends UtilGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
}

export default async function (
  tree: Tree,
  options: UtilGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfiguration = getProjectConfiguration(
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
  options: UtilGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}
