import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { ExamplePluginGeneratorSchema } from './schema';

interface NormalizedSchema extends ExamplePluginGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export default async function (
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
  const name = names(options.name).fileName;
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
