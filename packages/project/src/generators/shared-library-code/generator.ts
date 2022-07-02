import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { SharedLibraryCodeGeneratorSchema } from './schema';
import {
  PROJECT_SUFFIX_LIB_DATA_MODEL,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../shared/constants';
import {
  SchemaToSharedLibraryCodeInitialFiles,
  SchemaToSharedLibraryCodeInput,
} from '@gmjs/data-manipulation/src/lib/schema/to-shared-library-code/schema-to-shared-library-code-input';
import { readSchemas } from '../../shared/util';
import { readText, writeTexts } from '@gmnx/internal-util';
import { schemaToSharedLibraryCode } from '@gmjs/data-manipulation/src/lib/schema/to-shared-library-code/schema-to-shared-library-code';

interface NormalizedSchema extends SharedLibraryCodeGeneratorSchema {
  readonly npmScope: string;
  readonly dataModelProjectRoot: string;
  readonly sharedLibraryProjectRoot: string;
}

export async function generateSharedLibraryCode(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createSchemaToSharedInput(tree, normalizedOptions);
  const sharedLibraryCode = schemaToSharedLibraryCode(input);
  writeTexts(
    tree,
    path.join(normalizedOptions.sharedLibraryProjectRoot, 'src'),
    sharedLibraryCode
  );
}

function normalizeOptions(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    npmScope: getWorkspaceLayout(tree).npmScope,
    dataModelProjectRoot: getProjectRoot(
      tree,
      options,
      PROJECT_SUFFIX_LIB_DATA_MODEL
    ),
    sharedLibraryProjectRoot: getProjectRoot(
      tree,
      options,
      PROJECT_SUFFIX_LIB_SHARED
    ),
  };
}

function getProjectRoot(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema,
  projectSuffix: string
): string {
  const workspaceLayout = getWorkspaceLayout(tree);
  const name = names(options.name + projectSuffix).fileName;
  const projectDirectory = getProjectDirectory(options.directory, name);
  return `${workspaceLayout.libsDir}/${projectDirectory}`;
}

function getProjectDirectory(
  directory: string | undefined,
  name: string
): string {
  return directory ? `${names(directory).fileName}/${name}` : name;
}

function createSchemaToSharedInput(
  tree: Tree,
  normalizedOptions: NormalizedSchema
): SchemaToSharedLibraryCodeInput {
  const schemas = readSchemas(
    tree,
    path.join(normalizedOptions.dataModelProjectRoot, 'assets/schemas')
  );

  const initialFiles: SchemaToSharedLibraryCodeInitialFiles = {
    index: readText(
      tree,
      path.join(normalizedOptions.sharedLibraryProjectRoot, 'src/index.ts')
    ),
  };

  return {
    schemas,
    initialFiles,
    options: {
      mongoInterfacesDir: 'lib/mongo',
      dbInterfaceOptions: {
        dir: 'db',
        prefix: 'db',
      },
      appInterfaceOptions: {
        dir: 'app',
        prefix: '',
      },
    },
  };
}

export default generateSharedLibraryCode;
