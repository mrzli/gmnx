import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import * as path from 'path';
import { SchemasGeneratorSchema } from './schema';
import {
  deleteFilesWithExtension,
  readText,
  writeJson,
} from '@gmnx/internal-util';
import { dataModelToSchema } from '@gmjs/data-manipulation';
import { kebabCase } from '@gmjs/lib-util';

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
  deleteFilesWithExtension(tree, schemasDir, 'json');

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
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
  };
}

export default generateSchemas;
