import { names, Tree } from '@nrwl/devkit';
import { PostmanCollectionGeneratorSchema } from './schema';
import { getProjectRoot, readSchemas } from '../../shared/util';
import * as path from 'path';
import { writeJson } from '@gmnx/internal-util';
import { SchemaToPostmanCollectionInput } from '@gmjs/data-manipulation/src/lib/schema/to-postman-collection/schema-to-postman-collection-input';
import { PROJECT_SUFFIX_LIB_DATA_MODEL } from '../../shared/constants';
import { pascalCase } from '@gmjs/lib-util';
import { schemaToPostmanCollection } from '@gmjs/data-manipulation/src/lib/schema/to-postman-collection/schema-to-postman-collection';

interface NormalizedSchema extends PostmanCollectionGeneratorSchema {
  readonly baseName: string;
  readonly dataModelProjectRoot: string;
}

export async function generatePostmanCollection(
  tree: Tree,
  options: PostmanCollectionGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
  const input = createSchemaToPostmanCollectionInput(tree, normalizedOptions);
  const postmanCollectionPath = path.join(
    'output',
    `${normalizedOptions.baseName}-postman-collection.json`
  );
  const postmanCollection = schemaToPostmanCollection(input);
  writeJson(tree, postmanCollectionPath, postmanCollection);
}

function normalizeOptions(
  tree: Tree,
  options: PostmanCollectionGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    baseName: names(options.name).fileName,
    dataModelProjectRoot: getProjectRoot(
      tree,
      options,
      false,
      PROJECT_SUFFIX_LIB_DATA_MODEL
    ),
  };
}

function createSchemaToPostmanCollectionInput(
  tree: Tree,
  normalizedOptions: NormalizedSchema
): SchemaToPostmanCollectionInput {
  const schemas = readSchemas(
    tree,
    path.join(normalizedOptions.dataModelProjectRoot, 'assets/schemas')
  );

  return {
    schemas,
    postmanCollectionName: pascalCase(normalizedOptions.name),
  };
}

export default generatePostmanCollection;
