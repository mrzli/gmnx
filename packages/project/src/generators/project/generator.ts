import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { libraryGenerator as generateJsLib } from '@nrwl/js';
import {
  LibraryGeneratorSchema as JsLibSchema
} from '@nrwl/js/src/utils/schema';
import { applicationGenerator as generateNodeApp } from '@nrwl/node';
import {
  Schema as NodeAppSchema
} from '@nrwl/node/src/generators/application/schema';
import { applicationGenerator as generateNestApp } from '@nrwl/nest';
import {
  ApplicationGeneratorOptions as NestAppSchema
} from '@nrwl/nest/src/generators/application/schema';
import { applicationGenerator as generateReactApp } from '@nrwl/react';
import {
  Schema as ReactAppSchema
} from '@nrwl/react/src/generators/application/schema';
import { ProjectGeneratorSchema } from './schema';
import generateSchemas from '../schemas/generator';
import { SchemasGeneratorSchema } from '../schemas/schema';
import { Linter } from '@nrwl/linter';
import * as path from 'path';
import {
  PROJECT_SUFFIX_APP_BACKEND,
  PROJECT_SUFFIX_APP_CLI,
  PROJECT_SUFFIX_APP_WEB,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../shared/constants';
import {
  SharedLibraryCodeGeneratorSchema
} from '../shared-library-code/schema';
import generateSharedLibraryCode from '../shared-library-code/generator';
import { BackendAppCodeGeneratorSchema } from '../backend-app-code/schema';
import generateBackendAppCode from '../backend-app-code/generator';
import generatePostmanCollection from '../postman-collection/generator';
import { PostmanCollectionGeneratorSchema } from '../postman-collection/schema';
import generateAddMongoDatabaseToBackend
  from '../add-mongo-database-to-backend/generator';
import {
  AddMongoDatabaseToBackendGeneratorSchema
} from '../add-mongo-database-to-backend/schema';
import { CliAppCodeGeneratorSchema } from '../cli-app-code/schema';
import generateCliAppCode from '../cli-app-code/generator';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  const appBaseName = options.name;

  // const dataModelSchema: DataModelGeneratorSchema = {
  //   name: appBaseName,
  //   directory: options.directory,
  //   tags: `app:${appBaseName},scope:backend,type:util`,
  // };
  // await generateDataModel(tree, dataModelSchema);

  const schemasSchema: SchemasGeneratorSchema = {
    name: appBaseName,
    directory: options.directory,
  };
  await generateSchemas(tree, schemasSchema);

  // @nrwl/js:library
  const jsLibSchema: JsLibSchema = {
    name: appBaseName + PROJECT_SUFFIX_LIB_SHARED,
    directory: options.directory,
    tags: `app:${appBaseName},scope:shared,type:util`,
  };
  await generateJsLib(tree, jsLibSchema);
  cleanSharedLib(tree, jsLibSchema);

  const sharedLibraryCodeSchema: SharedLibraryCodeGeneratorSchema = {
    name: appBaseName,
    directory: options.directory,
  };
  await generateSharedLibraryCode(tree, sharedLibraryCodeSchema);

  // @nrwl/node:application
  const nodeAppSchema: NodeAppSchema = {
    name: appBaseName + PROJECT_SUFFIX_APP_CLI,
    directory: options.directory,
    tags: `app:${appBaseName},scope:backend,type:app`,
  };
  await generateNodeApp(tree, nodeAppSchema);

  const cliAppCodeSchema: CliAppCodeGeneratorSchema = {
    name: appBaseName,
    directory: options.directory,
  };
  await generateCliAppCode(tree, cliAppCodeSchema);

  // @nrwl/nest:application
  const nestAppSchema: NestAppSchema = {
    name: appBaseName + PROJECT_SUFFIX_APP_BACKEND,
    directory: options.directory,
    tags: `app:${appBaseName},scope:backend,type:app`,
  };
  await generateNestApp(tree, nestAppSchema);

  const addMongoDatabaseToBackendSchema: AddMongoDatabaseToBackendGeneratorSchema =
    {
      name: appBaseName,
      directory: options.directory,
    };
  await generateAddMongoDatabaseToBackend(
    tree,
    addMongoDatabaseToBackendSchema
  );

  const backendAppCodeSchema: BackendAppCodeGeneratorSchema = {
    name: appBaseName,
    directory: options.directory,
  };
  await generateBackendAppCode(tree, backendAppCodeSchema);

  const postmanCollectionSchema: PostmanCollectionGeneratorSchema = {
    name: appBaseName,
    directory: options.directory,
  };
  await generatePostmanCollection(tree, postmanCollectionSchema);

  // @nrwl/react:application
  const reactAppSchema: ReactAppSchema = {
    name: appBaseName + PROJECT_SUFFIX_APP_WEB,
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'scss',
    e2eTestRunner: 'none',
    unitTestRunner: 'jest',
    tags: `app:${appBaseName},scope:web,type:app`,
  };
  await generateReactApp(tree, reactAppSchema);
}

function cleanSharedLib(tree: Tree, options: JsLibSchema): void {
  const projectRoot = getLibProjectRoot(tree, options);
  tree.delete(path.join(projectRoot, 'src/lib'));
  tree.write(path.join(projectRoot, 'src/index.ts'), '');
}

interface BaseOptions {
  readonly name: string;
  readonly directory?: string;
}

function getLibProjectRoot(tree: Tree, options: BaseOptions): string {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  return `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
}

export default generateProject;
