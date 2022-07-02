import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { MongoJsonSchemaTypeObject } from '@gmjs/data-manipulation';
import { readTextsByExtension } from '@gmnx/internal-util';
import { textToJson } from '@gmjs/lib-util';
import { SharedLibraryCodeGeneratorSchema } from '../generators/shared-library-code/schema';

export function readSchemas(
  tree: Tree,
  dirPath: string
): readonly MongoJsonSchemaTypeObject[] {
  return readTextsByExtension(tree, dirPath, 'json').map((file) =>
    textToJson<MongoJsonSchemaTypeObject>(file.content)
  );
}

export function getProjectRoot(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema,
  isApp: boolean,
  projectSuffix: string
): string {
  const workspaceLayout = getWorkspaceLayout(tree);
  const name = names(options.name + projectSuffix).fileName;
  const projectDirectory = getProjectDirectory(options.directory, name);
  const packagesDir = isApp ? workspaceLayout.appsDir : workspaceLayout.libsDir;
  return `${packagesDir}/${projectDirectory}`;
}

function getProjectDirectory(
  directory: string | undefined,
  name: string
): string {
  return directory ? `${names(directory).fileName}/${name}` : name;
}
