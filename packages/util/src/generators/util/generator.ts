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
import { UtilGeneratorSchema } from './schema';

interface NormalizedSchema extends UtilGeneratorSchema {
  projectName: string;
  projectRoot: string;
  projectDirectory: string;
  parsedTags: string[];
}

export default async function (
  tree: Tree,
  options: UtilGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      cloc: {
        executor: '@gmnx/util:cloc',
        options: {
          ignoreDirs: ['.idea', '.vscode', 'node_modules', 'dist'],
          ignoreFiles: ['package-lock.json'],
        },
      },
      'start-mongo': {
        executor: '@gmnx/util:start-mongo',
        options: {
          containerName: 'mongo',
          mongoVersion: '5.0.8',
          port: 27017,
          dataDir: '~/docker/mongo',
        },
      },
      'stop-mongo': {
        executor: '@gmnx/util:stop-mongo',
        options: {
          containerName: 'mongo',
          mongoVersion: '5.0.8',
          port: 27017,
          dataDir: '~/docker/mongo',
        },
      },
      'publish-all': {
        executor: '@gmnx/util:publish-all',
        options: {},
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
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
