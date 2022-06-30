import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { DataModelGeneratorSchema } from './schema';
import { DATA_MODEL_PROJECT_SUFFIX } from '../../shared/constants';

interface NormalizedSchema extends DataModelGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
  readonly parsedTags: string[];
}

export async function generateDataModel(
  tree: Tree,
  options: DataModelGeneratorSchema
): Promise<void> {
  console.log(0);

  const normalizedOptions = normalizeOptions(tree, options);

  console.log(1);

  const projectConfiguration: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/assets`,
    tags: normalizedOptions.parsedTags,
  };

  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfiguration
  );

  console.log(2);

  addFiles(tree, normalizedOptions);

  console.log(3);

  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: DataModelGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName + DATA_MODEL_PROJECT_SUFFIX;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

function addFiles(tree: Tree, options: NormalizedSchema): void {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default generateDataModel;
