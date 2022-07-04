import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  ProjectConfiguration,
  Tree,
} from '@nrwl/devkit';
import path from 'path';
import { DataModelGeneratorSchema } from './schema';
import { PROJECT_SUFFIX_LIB_DATA_MODEL } from '../../shared/constants';
import {
  getProjectNameWithoutDir,
  getProjectValues,
  tagsToParsedTags,
} from '../../shared/util';
import { readText, writeText } from '@gmnx/internal-util';

interface NormalizedSchema extends DataModelGeneratorSchema {
  readonly baseName: string;
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
  readonly parsedTags: string[];
}

export async function generateDataModel(
  tree: Tree,
  options: DataModelGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

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

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);

  addDataModelYamlFile(tree, normalizedOptions);
}

function normalizeOptions(
  tree: Tree,
  options: DataModelGeneratorSchema
): NormalizedSchema {
  const { directory, name, root } = getProjectValues(
    tree,
    options,
    false,
    PROJECT_SUFFIX_LIB_DATA_MODEL
  );

  return {
    ...options,
    baseName: getProjectNameWithoutDir(options.name),
    projectName: name,
    projectRoot: root,
    projectDirectory: directory,
    parsedTags: tagsToParsedTags(options.tags),
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

function addDataModelYamlFile(
  tree: Tree,
  normalizedOptions: NormalizedSchema
): void {
  const dataModelYamlContent = readText(
    tree,
    `input/${normalizedOptions.baseName}-data-model.yaml`
  );
  writeText(
    tree,
    path.join(normalizedOptions.projectRoot, 'assets/yaml/data-model.yaml'),
    dataModelYamlContent
  );
}

export default generateDataModel;
