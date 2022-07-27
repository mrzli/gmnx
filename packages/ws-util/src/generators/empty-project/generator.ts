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
import { EmptyProjectGeneratorSchema } from './schema';
import {
  getProjectNameWithoutDir,
  getProjectValues,
  tagsToParsedTags,
} from '@gmnx/internal-util';

interface NormalizedSchema extends EmptyProjectGeneratorSchema {
  readonly baseName: string;
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
  readonly parsedTags: string[];
}

export async function generateEmptyProject(
  tree: Tree,
  options: EmptyProjectGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfiguration: ProjectConfiguration = {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/${normalizedOptions.srcDir}`,
    tags: normalizedOptions.parsedTags,
  };

  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfiguration
  );

  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: EmptyProjectGeneratorSchema
): NormalizedSchema {
  const projectValues = getProjectValues(tree, options, false);

  return {
    ...options,
    baseName: getProjectNameWithoutDir(options.name),
    ...projectValues,
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

export default generateEmptyProject;
