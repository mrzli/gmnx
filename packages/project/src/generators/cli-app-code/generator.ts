import {
  getWorkspaceLayout,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration as updateProjectConfigurationInternal,
} from '@nrwl/devkit';
import path from 'path';
import { CliAppCodeGeneratorSchema } from './schema';
import {
  schemaToCliAppCode,
  SchemaToCliAppCodeInput,
} from '@gmjs/data-manipulation';
import {
  getProjectNameWithoutDir,
  getProjectRoot,
  getProjectValues,
  readSchemas,
  writeTexts,
} from '@gmnx/internal-util';
import {
  PROJECT_SUFFIX_APP_CLI,
  PROJECT_SUFFIX_LIB_DATA_MODEL,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../shared/constants';

interface NormalizedSchema extends CliAppCodeGeneratorSchema {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseName: string;
  readonly dataModelProjectRoot: string;
  readonly cliAppProjectRoot: string;
  readonly cliAppProjectName: string;
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
  updateProjectConfiguration(tree, normalizedOptions.cliAppProjectName);
}

function normalizeOptions(
  tree: Tree,
  options: CliAppCodeGeneratorSchema
): NormalizedSchema {
  const workspaceLayout = getWorkspaceLayout(tree);
  const { name: cliAppProjectName, root: cliAppProjectRoot } = getProjectValues(
    tree,
    options,
    true,
    PROJECT_SUFFIX_APP_CLI
  );

  return {
    ...options,
    npmScope: workspaceLayout.npmScope,
    libsDir: workspaceLayout.libsDir,
    baseName: getProjectNameWithoutDir(options.name),
    dataModelProjectRoot: getProjectRoot(
      tree,
      options,
      false,
      PROJECT_SUFFIX_LIB_DATA_MODEL
    ),
    cliAppProjectRoot,
    cliAppProjectName,
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

function updateProjectConfiguration(tree: Tree, projectName: string): void {
  const buildTarget = `${projectName}:build`;

  const projectConfiguration = readProjectConfiguration(tree, projectName);
  projectConfiguration.targets = {
    ...projectConfiguration.targets,
    create: {
      executor: '@nrwl/node:node',
      options: {
        buildTarget,
        watch: false,
        inspect: false,
        args: ['create-db'],
      },
    },
    drop: {
      executor: '@nrwl/node:node',
      options: {
        buildTarget,
        watch: false,
        inspect: false,
        args: ['drop-db'],
      },
    },
    seed: {
      executor: '@nrwl/node:node',
      options: {
        buildTarget,
        watch: false,
        inspect: false,
        args: ['seed-db'],
      },
    },
  };
  updateProjectConfigurationInternal(tree, projectName, projectConfiguration);
}

export default generateCliAppCode;
