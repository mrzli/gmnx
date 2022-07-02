import { getWorkspaceLayout, names, Tree } from '@nrwl/devkit';
import { PostmanCollectionGeneratorSchema } from './schema';

interface NormalizedSchema extends PostmanCollectionGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
}

export async function generatePostmanCollection(
  tree: Tree,
  options: PostmanCollectionGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);
}

function normalizeOptions(
  tree: Tree,
  options: PostmanCollectionGeneratorSchema
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

export default generatePostmanCollection;
