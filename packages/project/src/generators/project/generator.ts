import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { libraryGenerator as generateJsLib } from '@nrwl/js';
import { LibraryGeneratorSchema as JsLibSchema } from '@nrwl/js/src/utils/schema';
import { applicationGenerator as generateNodeApp } from '@nrwl/node';
import { Schema as NodeAppSchema } from '@nrwl/node/src/generators/application/schema';
import { applicationGenerator as generateNestApp } from '@nrwl/nest';
import { ApplicationGeneratorOptions as NestAppSchema } from '@nrwl/nest/src/generators/application/schema';
import { applicationGenerator as generateReactApp } from '@nrwl/react';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { ProjectGeneratorSchema } from './schema';
import generateDataModel from '../data-model/generator';
import generateSchemas from '../schemas/generator';
import { DataModelGeneratorSchema } from '../data-model/schema';
import { SchemasGeneratorSchema } from '../schemas/schema';
import { Linter } from '@nrwl/linter';
import * as path from 'path';

const DATA_MODEL_PROJECT_SUFFIX = '-data-model';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  const appBaseName = options.name;

  const dataModelSchema: DataModelGeneratorSchema = {
    name: appBaseName + DATA_MODEL_PROJECT_SUFFIX,
    directory: options.directory,
    tags: `app:${appBaseName},scope:backend,type:util`,
  };
  await generateDataModel(tree, dataModelSchema);

  const schemasSchema: SchemasGeneratorSchema = {
    name: appBaseName + DATA_MODEL_PROJECT_SUFFIX,
    directory: options.directory,
  };
  await generateSchemas(tree, schemasSchema);

  // @nrwl/js:library
  const jsLibSchema: JsLibSchema = {
    name: appBaseName + '-shared',
    directory: options.directory,
    tags: `app:${appBaseName},scope:shared,type:util`,
  };
  await generateJsLib(tree, jsLibSchema);
  cleanSharedLib(tree, jsLibSchema);

  // @nrwl/node:application
  const nodeAppSchema: NodeAppSchema = {
    name: appBaseName + '-cli',
    directory: options.directory,
    tags: `app:${appBaseName},scope:backend,type:app`,
  };
  await generateNodeApp(tree, nodeAppSchema);

  // @nrwl/nest:application
  const nestAppSchema: NestAppSchema = {
    name: appBaseName + '-be',
    directory: options.directory,
    tags: `app:${appBaseName},scope:backend,type:app`,
  };
  await generateNestApp(tree, nestAppSchema);

  // @nrwl/react:application
  const reactAppSchema: ReactAppSchema = {
    name: appBaseName + '-web',
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
  tree.write(path.join(projectRoot, 'index.ts'), '');
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
