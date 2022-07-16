import path from 'path';
import { readProjectConfiguration, Tree } from '@nrwl/devkit';
import {
  schemaToCliAppCode,
  SchemaToCliAppCodeInput,
} from '@gmjs/data-manipulation';
import { writeTexts } from '@gmnx/internal-util';
import { updateProjectConfiguration as updateProjectConfigurationInternal } from 'nx/src/generators/utils/project-configuration';
import { NormalizedSchema, readProjectJsonSchemas } from '../../shared/util';

export async function generateCliCode(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const input: SchemaToCliAppCodeInput = {
    schemas: readProjectJsonSchemas(tree, options),
    options: {
      appsMonorepo: options,
    },
  };
  const cliAppCode = schemaToCliAppCode(input);
  writeTexts(
    tree,
    path.join(options.projects.cli.projectRoot, 'src'),
    cliAppCode
  );
  updateProjectConfiguration(tree, options);
}

function updateProjectConfiguration(
  tree: Tree,
  options: NormalizedSchema
): void {
  const projectName = options.projects.cli.projectName;
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
