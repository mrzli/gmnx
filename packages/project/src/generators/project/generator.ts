import { Tree } from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/react';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
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
  const dataModelSchema: DataModelGeneratorSchema = {
    name: options.name + DATA_MODEL_PROJECT_SUFFIX,
    directory: options.directory,
    tags: '',
  };
  await generateDataModel(tree, dataModelSchema);

  const schemasSchema: SchemasGeneratorSchema = {
    name: options.name + DATA_MODEL_PROJECT_SUFFIX,
    directory: options.directory,
  };
  await generateSchemas(tree, schemasSchema);

  const reactAppSchema: ReactAppSchema = {
    name: options.name + '-web',
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'scss',
    e2eTestRunner: 'none',
    unitTestRunner: 'jest',
  };
  await applicationGenerator(tree, reactAppSchema);
}

export default generateProject;
