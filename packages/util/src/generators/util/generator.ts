import {
  addProjectConfiguration,
  formatFiles,
  // generateFiles,
  getWorkspaceLayout,
  names,
  // offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
// import * as path from 'path';
import { UtilGeneratorSchema } from './schema';
import { ClocExecutorSchema } from '../../executors/cloc/schema';
import { PublishAllExecutorSchema } from '../../executors/publish-all/schema';
import { MongoStartExecutorSchema } from '../../executors/mongo-start/schema';
import { MongoStopExecutorSchema } from '../../executors/mongo-stop/schema';

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

  const clocOptions: ClocExecutorSchema = {
    ignoreDirs: ['.idea', '.vscode', 'node_modules', 'dist'],
    ignoreFiles: ['package-lock.json'],
  };

  const mongoOptions: MongoStartExecutorSchema & MongoStopExecutorSchema = {
    containerName: 'mongo',
    mongoVersion: '5.0.8',
    port: 27017,
    dataDir: '~/docker/mongo',
  };

  const mongoStartOptions: MongoStartExecutorSchema = {
    containerName: mongoOptions.containerName,
    mongoVersion: mongoOptions.mongoVersion,
    port: mongoOptions.port,
    dataDir: mongoOptions.dataDir,
  };
  const mongoStopOptions: MongoStopExecutorSchema = {
    containerName: mongoOptions.containerName,
    mongoVersion: mongoOptions.mongoVersion,
    port: mongoOptions.port,
    dataDir: mongoOptions.dataDir,
  };

  const publishAllOptions: PublishAllExecutorSchema = {};

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      cloc: {
        executor: '@gmnx/util:cloc',
        options: clocOptions,
      },
      'mongo-start': {
        executor: '@gmnx/util:mongo-start',
        options: mongoStartOptions,
      },
      'mongo-stop': {
        executor: '@gmnx/util:mongo-stop',
        options: mongoStopOptions,
      },
      'publish-all': {
        executor: '@gmnx/util:publish-all',
        options: publishAllOptions,
      },
    },
    tags: normalizedOptions.parsedTags,
  });
  // addFiles(tree, normalizedOptions);
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

// function addFiles(tree: Tree, options: NormalizedSchema): void {
//   const templateOptions = {
//     ...options,
//     ...names(options.name),
//     offsetFromRoot: offsetFromRoot(options.projectRoot),
//     template: '',
//   };
//   generateFiles(
//     tree,
//     path.join(__dirname, 'files'),
//     options.projectRoot,
//     templateOptions
//   );
// }
