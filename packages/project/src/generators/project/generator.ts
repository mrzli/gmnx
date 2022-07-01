import { Tree } from '@nrwl/devkit';
import { applicationGenerator as generateReactApp } from '@nrwl/react';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { applicationGenerator as generateNestApp } from '@nrwl/nest';
import { ApplicationGeneratorOptions as NestAppSchema } from '@nrwl/nest/src/generators/application/schema';
import { ProjectGeneratorSchema } from './schema';
import generateDataModel from '../data-model/generator';
import generateSchemas from '../schemas/generator';
import { DataModelGeneratorSchema } from '../data-model/schema';
import { SchemasGeneratorSchema } from '../schemas/schema';
import { Linter } from '@nrwl/linter';

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

  // @nrwl/nest:application
  const nestAppSchema: NestAppSchema = {
    name: appBaseName + '-be',
  };
  await generateNestApp(tree, nestAppSchema);
}

export default generateProject;
