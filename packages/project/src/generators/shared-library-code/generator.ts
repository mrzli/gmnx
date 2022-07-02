import {
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  names,
  offsetFromRoot,
  Tree,
} from '@nrwl/devkit';
import * as path from 'path';
import { SharedLibraryCodeGeneratorSchema } from './schema';

interface NormalizedSchema extends SharedLibraryCodeGeneratorSchema {
  readonly npmScope: string;
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
}

export async function generateSharedLibraryCode(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  addProjectConfiguration(tree, normalizedOptions.projectName, {
    root: normalizedOptions.projectRoot,
    projectType: 'library',
    sourceRoot: `${normalizedOptions.projectRoot}/src`,
    targets: {
      build: {
        executor: '@gmnx/project:build',
      },
    },
  });
  addFiles(tree, normalizedOptions);
  await formatFiles(tree);
}

function normalizeOptions(
  tree: Tree,
  options: SharedLibraryCodeGeneratorSchema
): NormalizedSchema {
  const workspaceLayout = getWorkspaceLayout(tree);
  const npmScope = workspaceLayout.npmScope;

  const name = names(options.name).fileName;
  const projectDirectory = options.directory
    ? `${names(options.directory).fileName}/${name}`
    : name;
  const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
  const projectRoot = `${workspaceLayout.libsDir}/${projectDirectory}`;

  return {
    ...options,
    projectName,
    projectRoot,
    projectDirectory,
    npmScope,
  };
}

// function createSchemaToSharedInput(
//   tree: Tree,
//   normalizedOptions: NormalizedSchema
// ): SchemaToSharedLibraryCodeInput {
//   const schemas = readJsonSync<readonly MongoJsonSchemaTypeObject[]>(
//     path.join(testDir, 'input/schemas.json')
//   );
//   const initialFiles: SchemaToSharedLibraryCodeInitialFiles = {
//     index: readText(tree, path.join()),
//   };
//
//   return {
//     schemas,
//     initialFiles,
//     options: {
//       mongoInterfacesDir: 'lib/mongo',
//       dbInterfaceOptions: {
//         dir: 'db',
//         prefix: 'db',
//       },
//       appInterfaceOptions: {
//         dir: 'app',
//         prefix: 'app',
//       },
//     },
//   };
// }

function addFiles(tree: Tree, options: NormalizedSchema): void {
  const templateOptions = {
    ...options,
    ...names(options.name),
    offsetFromRoot: offsetFromRoot(options.projectRoot),
    template: '',
  };
  generateFiles(
    tree,
    path.join(__dirname, 'files'),
    options.projectRoot,
    templateOptions
  );
}

export default generateSharedLibraryCode;
