import { Tree } from '@nrwl/devkit';
import path from 'path';
import { SchemasGeneratorSchema } from './schema';
import {
  deleteFilesByExtension,
  getProjectValues,
  readText,
  writeJson,
} from '@gmnx/internal-util';
import { dataModelToSchema } from '@gmjs/data-manipulation';
import { kebabCase } from '@gmjs/lib-util';
import { PROJECT_SUFFIX_LIB_DATA_MODEL } from '../../shared/constants';

interface NormalizedSchema extends SchemasGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
}

export async function generateSchemas(
  tree: Tree,
  options: SchemasGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const dataModelYamlContent = readText(
    tree,
    path.join(normalizedOptions.projectRoot, 'assets/yaml/data-model.yaml')
  );

  const schemas = dataModelToSchema(dataModelYamlContent);

  const schemasDir = path.join(normalizedOptions.projectRoot, 'assets/schemas');
  deleteFilesByExtension(tree, schemasDir, 'json');

  for (const mongoSchema of schemas) {
    const schemaFileName = `${kebabCase(mongoSchema.title)}.json`;
    const schemaFilePath = path.join(schemasDir, schemaFileName);
    writeJson(tree, schemaFilePath, mongoSchema);
  }
}

function normalizeOptions(
  tree: Tree,
  options: SchemasGeneratorSchema
): NormalizedSchema {
  const projectValues = getProjectValues(
    tree,
    options,
    false,
    PROJECT_SUFFIX_LIB_DATA_MODEL
  );

  return {
    ...options,
    ...projectValues,
  };
}

export default generateSchemas;
