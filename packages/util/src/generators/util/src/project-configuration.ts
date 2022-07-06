import { ProjectConfiguration } from '@nrwl/devkit';
import { ClocExecutorSchema } from '../../../executors/cloc/schema';
import { MongoStartExecutorSchema } from '../../../executors/mongo-start/schema';
import { MongoStopExecutorSchema } from '../../../executors/mongo-stop/schema';
import { PostgresStartExecutorSchema } from '../../../executors/postgres-start/schema';
import { PostgresStopExecutorSchema } from '../../../executors/postgres-stop/schema';
import { PublishAllExecutorSchema } from '../../../executors/publish-all/schema';

export function getProjectConfiguration(
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
        executor: '@gmnx/util:cloc',
        options: clocOptions,
      },
      'mongo-start': {
        executor: '@gmnx/util:mongo-start',
        options: mongoStartOptions,
      },
      'mongo-stop': {
        executor: '@gmnx/util:mongo-stop',
        options: mongoStopOptions,
      },
      'postgres-start': {
        executor: '@gmnx/util:postgres-start',
        options: postgresStartOptions,
      },
      'postgres-stop': {
        executor: '@gmnx/util:postgres-stop',
        options: postgresStopOptions,
      },
      'publish-all': {
        executor: '@gmnx/util:publish-all',
        options: publishAllOptions,
      },
    },
  };
}
