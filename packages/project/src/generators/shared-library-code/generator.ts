import { Tree } from '@nrwl/devkit';
import path from 'path';
import { SharedLibraryCodeGeneratorSchema } from './schema';
import {
  PROJECT_SUFFIX_LIB_DATA_MODEL,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../shared/constants';
import {
  getProjectRoot,
  readSchemas,
  readText,
  writeTexts,
} from '@gmnx/internal-util';
import {
  schemaToSharedLibraryCode,
  SchemaToSharedLibraryCodeInitialFiles,
  SchemaToSharedLibraryCodeInput,
} from '@gmjs/data-manipulation';

interface NormalizedSchema extends SharedLibraryCodeGeneratorSchema {
  readonly dataModelProjectRoot: string;
  readonly sharedLibraryProjectRoot: string;
}

export async function generateSharedLibraryCode(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createSchemaToSharedLibraryInput(tree, normalizedOptions);
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
    dataModelProjectRoot: getProjectRoot(
      tree,
      options,
      false,
      PROJECT_SUFFIX_LIB_DATA_MODEL
    ),
    sharedLibraryProjectRoot: getProjectRoot(
      tree,
      options,
      false,
      PROJECT_SUFFIX_LIB_SHARED
    ),
  };
}

function createSchemaToSharedLibraryInput(
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
      interfacePrefixes: {
        db: 'db',
        app: '',
      },
    },
  };
}

export default generateSharedLibraryCode;
