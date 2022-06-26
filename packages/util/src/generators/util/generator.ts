import {
  addProjectConfiguration,
  formatFiles,
  // generateFiles,
  getWorkspaceLayout,
  names,
  // offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import { UtilGeneratorSchema } from './schema';
import {
  getProjectConfiguration,
  NormalizedSchema,
} from './src/project-configuration';

export default async function (
  tree: Tree,
  options: UtilGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  const projectConfiguration = getProjectConfiguration(normalizedOptions);

  addProjectConfiguration(
    tree,
    normalizedOptions.projectName,
    projectConfiguration
  );
  // addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: UtilGeneratorSchema
): NormalizedSchema {
  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${getWorkspaceLayout(tree).libsDir}/${projectDirectory}`;
  const parsedTags = options.tags
    ? options.tags.split(',').map((s) => s.trim())
    : [];

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    parsedTags,
  };
}

// function addFiles(tree: Tree, options: NormalizedSchema): void {
//   const templateOptions = {
//     ...options,
//     ...names(options.name),
//     offsetFromRoot: offsetFromRoot(options.projectRoot),
//     template: '',
//   };
//   generateFiles(
//     tree,
//     path.join(__dirname, 'files'),
//     options.projectRoot,
//     templateOptions
//   );
// }
