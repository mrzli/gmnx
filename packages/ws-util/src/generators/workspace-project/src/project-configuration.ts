import { ProjectConfiguration } from '@nrwl/devkit';
import { ClocExecutorSchema } from '../../../executors/cloc/schema';
import { MongoStartExecutorSchema } from '../../../executors/mongo-start/schema';
import { MongoStopExecutorSchema } from '../../../executors/mongo-stop/schema';
import { PostgresStartExecutorSchema } from '../../../executors/postgres-start/schema';
import { PostgresStopExecutorSchema } from '../../../executors/postgres-stop/schema';
import { PublishAllExecutorSchema } from '../../../executors/publish-all/schema';
import { isNotNullish } from '@gmjs/util';
import { stringToNonRandomInteger } from '@gmjs/lib-util';
import { WorkspaceProjectGeneratorDbType } from '../schema';

const GMJS_BASE_RUNTIME_DEPENDENCIES: readonly string[] = [
  'browser-util',
  'db-util',
  'fs-util',
  'lib-util',
  'nest-util',
  'react-util',
  'util',
];

const GMJS_MONGO_DEPENDENCIES: readonly string[] = ['mongo-util'];
const GMJS_POSTGRES_DEPENDENCIES: readonly string[] = ['postgres-util'];

const GMJS_DEVELOPMENT_DEPENDENCIES: readonly string[] = ['test-util'];

const GMNX_DEVELOPMENT_DEPENDENCIES: readonly string[] = ['ws-util'];

export function getProjectConfiguration(
  projectName: string,
  projectRoot: string,
  dbName: string,
  dbType: WorkspaceProjectGeneratorDbType
): ProjectConfiguration {
  const clocOptions: ClocExecutorSchema = {
    ignoreDirs: ['.idea', '.vscode', 'node_modules', 'dist'],
    ignoreFiles: ['package-lock.json'],
  };

  const publishAllOptions: PublishAllExecutorSchema = {};

  const GMJS_RUNTIME_DEPENDENCIES: readonly string[] = [
    ...GMJS_BASE_RUNTIME_DEPENDENCIES,
    ...(isMongo(dbType) ? GMJS_MONGO_DEPENDENCIES : []),
    ...(isPostgres(dbType) ? GMJS_POSTGRES_DEPENDENCIES : []),
  ];

  return {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {
      cloc: {
        executor: '@gmnx/ws-util:cloc',
        options: clocOptions,
      },
      ...getMongoTargets(dbType),
      ...getPostgresTargets(dbName, dbType),
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

function getMongoTargets(dbType: WorkspaceProjectGeneratorDbType): ProjectConfiguration['targets'] {
  if (!isMongo(dbType)) {
    return {};
  }

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

  return {
    'mongo-start': {
      executor: '@gmnx/ws-util:mongo-start',
      options: mongoStartOptions,
    },
    'mongo-stop': {
      executor: '@gmnx/ws-util:mongo-stop',
      options: mongoStopOptions,
    },
  };
}

function getPostgresTargets(
  dbName: string,
  dbType: WorkspaceProjectGeneratorDbType
): ProjectConfiguration['targets'] {
  if (!isPostgres(dbType)) {
    return {};
  }

  const postgresOptions: PostgresStartExecutorSchema &
    PostgresStopExecutorSchema = {
    containerName: `postgres-${dbName}`,
    postgresVersion: '14.2',
    port: stringToNonRandomInteger(dbName, 14000, 17999),
    dataDir: `~/docker/postgres/${dbName}`,
    dbName,
    username: 'postgres',
    password: 'password',
  };

  const postgresStartOptions: PostgresStartExecutorSchema = {
    containerName: postgresOptions.containerName,
    postgresVersion: postgresOptions.postgresVersion,
    port: postgresOptions.port,
    dataDir: postgresOptions.dataDir,
    dbName: postgresOptions.dbName,
    username: postgresOptions.username,
    password: postgresOptions.password,
  };
  const postgresStopOptions: PostgresStopExecutorSchema = {
    containerName: postgresOptions.containerName,
    postgresVersion: postgresOptions.postgresVersion,
    port: postgresOptions.port,
    dataDir: postgresOptions.dataDir,
    dbName: postgresOptions.dbName,
    username: postgresOptions.username,
    password: postgresOptions.password,
  };

  return {
    'postgres-start': {
      executor: '@gmnx/ws-util:postgres-start',
      options: postgresStartOptions,
    },
    'postgres-stop': {
      executor: '@gmnx/ws-util:postgres-stop',
      options: postgresStopOptions,
    },
  };
}

function isMongo(dbType: WorkspaceProjectGeneratorDbType): boolean {
  return shouldInstallDb('mongo', dbType);
}

function isPostgres(dbType: WorkspaceProjectGeneratorDbType): boolean {
  return shouldInstallDb('postgres', dbType);
}

function shouldInstallDb(
  queriedDbType: Exclude<WorkspaceProjectGeneratorDbType, 'any'>,
  configDbType: WorkspaceProjectGeneratorDbType
): boolean {
  return configDbType === 'any' || queriedDbType === configDbType;
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
