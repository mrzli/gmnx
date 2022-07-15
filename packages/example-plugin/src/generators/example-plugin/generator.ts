import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import path from 'path';
import { ExamplePluginGeneratorSchema } from './schema';
import { getProjectValues, tagsToParsedTags } from '@gmnx/internal-util';

interface NormalizedSchema extends ExamplePluginGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
  readonly parsedTags: string[];
}

export async function generateExample(
  tree: Tree,
  options: ExamplePluginGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@gmnx/example-plugin:build',
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: ExamplePluginGeneratorSchema
): NormalizedSchema {
  const { directory, name, root } = getProjectValues(tree, options, false);

  return {
    ...options,
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

export default generateExample;
