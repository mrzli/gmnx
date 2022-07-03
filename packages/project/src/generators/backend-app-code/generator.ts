import { Tree } from '@nrwl/devkit';
import * as path from 'path';
import { readText, writeTexts } from '@gmnx/internal-util';
import {
  PROJECT_SUFFIX_APP_BACKEND,
  PROJECT_SUFFIX_LIB_DATA_MODEL,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../shared/constants';
import { getNpmScope, getProjectRoot, readSchemas } from '../../shared/util';
import { BackendAppCodeGeneratorSchema } from './schema';
import {
  schemaToBackendAppCode,
  SchemaToBackendAppCodeInitialFiles,
  SchemaToBackendAppCodeInput,
} from '@gmjs/data-manipulation';

interface NormalizedSchema extends BackendAppCodeGeneratorSchema {
  readonly npmScope: string;
  readonly dataModelProjectRoot: string;
  readonly backendAppProjectRoot: string;
}

export async function generateBackendAppCode(
  tree: Tree,
  options: BackendAppCodeGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createSchemaToBackendAppInput(tree, normalizedOptions);
  const backendAppCode = schemaToBackendAppCode(input);
  writeTexts(
    tree,
    path.join(normalizedOptions.backendAppProjectRoot, 'src'),
    backendAppCode
  );
}

function normalizeOptions(
  tree: Tree,
  options: BackendAppCodeGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    npmScope: getNpmScope(tree),
    dataModelProjectRoot: getProjectRoot(
      tree,
      options,
      false,
      PROJECT_SUFFIX_LIB_DATA_MODEL
    ),
    backendAppProjectRoot: getProjectRoot(
      tree,
      options,
      true,
      PROJECT_SUFFIX_APP_BACKEND
    ),
  };
}

function createSchemaToBackendAppInput(
  tree: Tree,
  normalizedOptions: NormalizedSchema
): SchemaToBackendAppCodeInput {
  const schemas = readSchemas(
    tree,
    path.join(normalizedOptions.dataModelProjectRoot, 'assets/schemas')
  );

  const initialFiles: SchemaToBackendAppCodeInitialFiles = {
    appModule: readText(
      tree,
      path.join(
        normalizedOptions.backendAppProjectRoot,
        'src/app/app.module.ts'
      )
    ),
  };

  return {
    schemas,
    initialFiles,
    options: {
      libsMonorepo: {
        npmScope: 'gmjs',
        utilProjectName: 'util',
        nestUtilProjectName: 'nest-util',
      },
      appsMonorepo: {
        npmScope: normalizedOptions.npmScope,
        sharedProjectName: normalizedOptions.name + PROJECT_SUFFIX_LIB_SHARED,
      },
      dbPrefix: 'db',
      appPrefix: '',
    },
  };
}

export default generateBackendAppCode;
