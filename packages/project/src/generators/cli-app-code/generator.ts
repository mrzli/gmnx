import {
  getWorkspaceLayout,
  names,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration as updateProjectConfigurationInternal,
} from '@nrwl/devkit';
import * as path from 'path';
import { CliAppCodeGeneratorSchema } from './schema';
import {
  schemaToCliAppCode,
  SchemaToCliAppCodeInput,
} from '@gmjs/data-manipulation';
import { getProjectRoot, readSchemas } from '../../shared/util';
import {
  PROJECT_SUFFIX_APP_CLI,
  PROJECT_SUFFIX_LIB_DATA_MODEL,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../shared/constants';
import { writeTexts } from '@gmnx/internal-util';

interface NormalizedSchema extends CliAppCodeGeneratorSchema {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseName: string;
  readonly dataModelProjectRoot: string;
  readonly cliAppProjectRoot: string;
}

export async function generateCliAppCode(
  tree: Tree,
  options: CliAppCodeGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createSchemaToCliAppInput(tree, normalizedOptions);
  const cliAppCode = schemaToCliAppCode(input);
  writeTexts(
    tree,
    path.join(normalizedOptions.cliAppProjectRoot, 'src'),
    cliAppCode
  );
  updateProjectConfiguration(tree);
}

function normalizeOptions(
  tree: Tree,
  options: CliAppCodeGeneratorSchema
): NormalizedSchema {
  const workspaceLayout = getWorkspaceLayout(tree);

  return {
    ...options,
    npmScope: workspaceLayout.npmScope,
    libsDir: workspaceLayout.libsDir,
    baseName: names(options.name).fileName,
    dataModelProjectRoot: getProjectRoot(
      tree,
      options,
      false,
      PROJECT_SUFFIX_LIB_DATA_MODEL
    ),
    cliAppProjectRoot: getProjectRoot(
      tree,
      options,
      true,
      PROJECT_SUFFIX_APP_CLI
    ),
  };
}

function createSchemaToCliAppInput(
  tree: Tree,
  normalizedOptions: NormalizedSchema
): SchemaToCliAppCodeInput {
  const schemas = readSchemas(
    tree,
    path.join(normalizedOptions.dataModelProjectRoot, 'assets/schemas')
  );

  return {
    schemas,
    options: {
      libsMonorepo: {
        npmScope: 'gmjs',
        utilProjectName: 'util',
        mongoUtilProjectName: 'mongo-util',
      },
      appsMonorepo: {
        npmScope: normalizedOptions.npmScope,
        libsDir: normalizedOptions.libsDir,
        projectName: normalizedOptions.baseName,
        sharedLibProjectName:
          normalizedOptions.name + PROJECT_SUFFIX_LIB_SHARED,
      },
    },
  };
}

function updateProjectConfiguration(tree: Tree): void {
  // const projectConfiguration = readProjectConfiguration(tree, '');
  // updateProjectConfigurationInternal()
}

export default generateCliAppCode;
