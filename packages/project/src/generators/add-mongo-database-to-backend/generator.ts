import { Tree } from '@nrwl/devkit';
import { AddMongoDatabaseToBackendGeneratorSchema } from './schema';
import {
  getProjectNameWithoutDir,
  getProjectRoot,
  readText,
  writeText,
} from '@gmnx/internal-util';
import path from 'path';
import { PROJECT_SUFFIX_APP_BACKEND } from '../../shared/constants';
import {
  addMongoDatabaseToBackend,
  AddMongoDatabaseToBackendInput,
} from '@gmjs/data-manipulation';

interface NormalizedSchema extends AddMongoDatabaseToBackendGeneratorSchema {
  readonly baseName: string;
  readonly backendAppProjectRoot: string;
}

export async function generateAddMongoDatabaseToBackend(
  tree: Tree,
  options: AddMongoDatabaseToBackendGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createAddMongoDatabaseToBackendInput(tree, normalizedOptions);
  const appModuleFile = addMongoDatabaseToBackend(input);
  writeText(tree, getAppModulePath(normalizedOptions), appModuleFile);
}

function normalizeOptions(
  tree: Tree,
  options: AddMongoDatabaseToBackendGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    baseName: getProjectNameWithoutDir(options.name),
    backendAppProjectRoot: getProjectRoot(
      tree,
      options,
      true,
      PROJECT_SUFFIX_APP_BACKEND
    ),
  };
}

function createAddMongoDatabaseToBackendInput(
  tree: Tree,
  normalizedOptions: NormalizedSchema
): AddMongoDatabaseToBackendInput {
  const appModule: string = readText(tree, getAppModulePath(normalizedOptions));

  return {
    appModuleFile: appModule,
    options: {
      projectName: normalizedOptions.baseName,
      libsMonorepoNpmScope: 'gmjs',
      nestUtilProjectName: 'nest-util',
    },
  };
}

function getAppModulePath(normalizedOptions: NormalizedSchema): string {
  return path.join(
    normalizedOptions.backendAppProjectRoot,
    'src/app/app.module.ts'
  );
}

export default generateAddMongoDatabaseToBackend;
