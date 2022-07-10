import { ProjectConfiguration } from '@nrwl/devkit';
import { ClocExecutorSchema } from '../../../executors/cloc/schema';
import { MongoStartExecutorSchema } from '../../../executors/mongo-start/schema';
import { MongoStopExecutorSchema } from '../../../executors/mongo-stop/schema';
import { PostgresStartExecutorSchema } from '../../../executors/postgres-start/schema';
import { PostgresStopExecutorSchema } from '../../../executors/postgres-stop/schema';
import { PublishAllExecutorSchema } from '../../../executors/publish-all/schema';
import { isNotNullish } from '@gmjs/util';

const GMJS_RUNTIME_DEPENDENCIES: readonly string[] = [
  'data-manipulation',
  'fs-util',
  'lib-util',
  'mongo-util',
  'nest-util',
  'util',
];

const GMJS_DEVELOPMENT_DEPENDENCIES: readonly string[] = ['test-util'];

const GMNX_DEVELOPMENT_DEPENDENCIES: readonly string[] = ['ws-util', 'project'];

export function getProjectConfiguration(
  projectName: string,
  projectRoot: string
): ProjectConfiguration {
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

  const postgresOptions: PostgresStartExecutorSchema &
    PostgresStopExecutorSchema = {
    containerName: 'postgres',
    postgresVersion: '14.2',
    port: 15432,
    dataDir: '~/docker/postgres',
    username: 'postgres',
    password: 'password',
  };

  const postgresStartOptions: PostgresStartExecutorSchema = {
    containerName: postgresOptions.containerName,
    postgresVersion: postgresOptions.postgresVersion,
    port: postgresOptions.port,
    dataDir: postgresOptions.dataDir,
    username: postgresOptions.username,
    password: postgresOptions.password,
  };
  const postgresStopOptions: PostgresStopExecutorSchema = {
    containerName: postgresOptions.containerName,
    postgresVersion: postgresOptions.postgresVersion,
    port: postgresOptions.port,
    dataDir: postgresOptions.dataDir,
    username: postgresOptions.username,
    password: postgresOptions.password,
  };

  const publishAllOptions: PublishAllExecutorSchema = {};

  return {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      cloc: {
        executor: '@gmnx/ws-util:cloc',
        options: clocOptions,
      },
      'mongo-start': {
        executor: '@gmnx/ws-util:mongo-start',
        options: mongoStartOptions,
      },
      'mongo-stop': {
        executor: '@gmnx/ws-util:mongo-stop',
        options: mongoStopOptions,
      },
      'postgres-start': {
        executor: '@gmnx/ws-util:postgres-start',
        options: postgresStartOptions,
      },
      'postgres-stop': {
        executor: '@gmnx/ws-util:postgres-stop',
        options: postgresStopOptions,
      },
      'publish-all': {
        executor: '@gmnx/ws-util:publish-all',
        options: publishAllOptions,
      },
      'update-gmjs': {
        executor: 'nx:run-commands',
        options: {
          commands: [
            getInstallDependenciesCommand(
              GMJS_RUNTIME_DEPENDENCIES,
              false,
              'gmjs',
              'latest'
            ),
            getInstallDependenciesCommand(
              GMJS_DEVELOPMENT_DEPENDENCIES,
              true,
              'gmjs',
              'latest'
            ),
          ],
          parallel: false,
        },
      },
      'update-gmnx': {
        executor: 'nx:run-commands',
        options: {
          command: getInstallDependenciesCommand(
            GMNX_DEVELOPMENT_DEPENDENCIES,
            true,
            'gmnx',
            'latest'
          ),
        },
      },
      'update-gmall': {
        executor: 'nx:run-commands',
        options: {
          commands: [
            `nx run ${projectName}:update-gmjs`,
            `nx run ${projectName}:update-gmnx`,
          ],
          parallel: false,
        },
      },
    },
  };
}

function getInstallDependenciesCommand(
  deps: readonly string[],
  isDevelopment: boolean,
  scope?: string,
  version?: string
): string {
  return [
    'npm install',
    isDevelopment ? '-D' : undefined,
    ...deps.map((dep) => getDependencyString(dep, scope, version)),
    '-f',
  ]
    .filter(isNotNullish)
    .join(' ');
}

function getDependencyString(
  dep: string,
  scope?: string,
  version?: string
): string {
  return [
    scope ? `@${scope}/` : undefined,
    dep,
    version ? `@${version}` : undefined,
  ]
    .filter(isNotNullish)
    .join('');
}
