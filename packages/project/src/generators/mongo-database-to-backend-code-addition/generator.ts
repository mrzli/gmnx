import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import { MongoDatabaseToBackendCodeAdditionGeneratorSchema } from './schema';
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

interface NormalizedSchema
  extends MongoDatabaseToBackendCodeAdditionGeneratorSchema {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseName: string;
  readonly backendAppProjectRoot: string;
}

export async function generateMongoDatabaseToBackendCodeAddition(
  tree: Tree,
  options: MongoDatabaseToBackendCodeAdditionGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createAddMongoDatabaseToBackendInput(tree, normalizedOptions);
  const appModuleFile = addMongoDatabaseToBackend(input);
  writeText(tree, getAppModulePath(normalizedOptions), appModuleFile);
}

function normalizeOptions(
  tree: Tree,
  options: MongoDatabaseToBackendCodeAdditionGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    ...getWorkspaceLayout(tree),
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
      baseProjectName: normalizedOptions.baseName,
      libsDir: normalizedOptions.libsDir,
      npmScope: normalizedOptions.npmScope,
    },
  };
}

function getAppModulePath(normalizedOptions: NormalizedSchema): string {
  return path.join(
    normalizedOptions.backendAppProjectRoot,
    'src/app/app.module.ts'
  );
}

export default generateMongoDatabaseToBackendCodeAddition;
