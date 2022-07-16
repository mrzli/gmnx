import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import path from 'path';
import {
  getProjectRoot,
  readSchemas,
  readText,
  writeTexts,
} from '@gmnx/internal-util';
import {
  PROJECT_SUFFIX_APP_BACKEND,
  PROJECT_SUFFIX_LIB_DATA_MODEL,
} from '../../shared/constants';
import { BackendAppCodeGeneratorSchema } from './schema';
import {
  schemaToBackendAppCode,
  SchemaToBackendAppCodeInitialFiles,
  SchemaToBackendAppCodeInput,
} from '@gmjs/data-manipulation';

interface NormalizedSchema extends BackendAppCodeGeneratorSchema {
  readonly npmScope: string;
  readonly libsDir: string;
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
    ...getWorkspaceLayout(tree),
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
      appsMonorepo: {
        npmScope: normalizedOptions.npmScope,
        libsDir: normalizedOptions.libsDir,
        baseProjectName: normalizedOptions.name,
      },
      interfacePrefixes: {
        db: 'db',
        app: '',
      },
    },
  };
}

export default generateBackendAppCode;
