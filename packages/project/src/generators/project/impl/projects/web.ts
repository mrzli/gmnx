import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
} from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../../schema';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { PROJECT_SUFFIX_APP_WEB } from '../../../../shared/constants';
import { Linter } from '@nrwl/linter';
import { applicationGenerator as generateReactAppInternal } from '@nrwl/react/src/generators/application/application';
import {
  deleteFiles,
  getProjectRoot as getProjectRootInternal,
  getProjectValues,
  readText,
  writeText,
} from '@gmnx/internal-util';
import path from 'path';
import { PROJECT_PACKAGES } from '../shared/package-versions';
import { stringArrayToLines } from '@gmjs/lib-util';
import { objectPickFields } from '@gmjs/util';
import {
  AddMongoDatabaseToBackendInput,
  schemaToSharedLibraryCode,
  SchemaToWebBackendApiCodeInput,
} from '@gmjs/data-manipulation';
import { SchemasGeneratorSchema } from '../../../schemas/schema';
import { pathRelativeToFiles } from '../shared/util';

interface NormalizedSchema extends SchemasGeneratorSchema {
  readonly projectName: string;
  readonly projectRoot: string;
  readonly projectDirectory: string;
}

export async function generateWeb(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  const normalizedOptions = normalizeOptions(tree, options);

  await generateReactApp(tree, options);
  cleanProject(tree, options);
  await setupTailwind(tree, options);
  // setupBackendApi(tree, options);
}

function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorSchema
): NormalizedSchema {
  const projectValues = getProjectValues(
    tree,
    options,
    true,
    PROJECT_SUFFIX_APP_WEB
  );

  return {
    ...options,
    ...projectValues,
  };
}

async function generateReactApp(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // @nrwl/react:application
  const reactAppSchema: ReactAppSchema = {
    name: options.name + PROJECT_SUFFIX_APP_WEB,
    directory: options.directory,
    linter: Linter.EsLint,
    skipFormat: false,
    style: 'scss',
    e2eTestRunner: 'none',
    unitTestRunner: 'jest',
    tags: `app:${options.name},scope:web,type:app`,
  };
  await generateReactAppInternal(tree, reactAppSchema);
}

function cleanProject(tree: Tree, options: ProjectGeneratorSchema): void {
  const projectRoot = getProjectRoot(tree, options);
  deleteFiles(
    tree,
    ['src/main.tsx', 'src/app'].map((p) => path.join(projectRoot, p))
  );

  generateFiles(tree, pathRelativeToFiles('web/clean'), projectRoot, {
    template: '',
  });
}

function getProjectRoot(tree: Tree, options: ProjectGeneratorSchema): string {
  return getProjectRootInternal(tree, options, true, PROJECT_SUFFIX_APP_WEB);
}

async function setupTailwind(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  const projectRoot = getProjectRoot(tree, options);

  generateFiles(tree, pathRelativeToFiles('web/tailwind'), projectRoot, {
    template: '',
  });

  const stylesFilePath = path.join(projectRoot, 'src/styles.scss');
  const stylesFile = readText(tree, stylesFilePath);
  const updatedStylesFile = stylesFile.concat(
    stringArrayToLines([
      '',
      '@tailwind components;',
      '@tailwind base;',
      '@tailwind utilities;',
    ])
  );

  writeText(tree, stylesFilePath, updatedStylesFile);

  await addDependenciesToPackageJson(
    tree,
    {},
    objectPickFields(PROJECT_PACKAGES, [
      'tailwindcss',
      'postcss',
      'autoprefixer',
    ])
  );
}

// function setupBackendApi(tree: Tree, options: ProjectGeneratorSchema): void {
//   const input = createSchemaToSharedLibraryInput(tree, normalizedOptions);
//   const sharedLibraryCode = schemaToSharedLibraryCode(input);
//   writeTexts(
//     tree,
//     path.join(normalizedOptions.sharedLibraryProjectRoot, 'src'),
//     sharedLibraryCode
//   );
// }
//
// function createSchemaToWebBackendApiInput(
//   tree: Tree,
//   normalizedOptions: NormalizedSchema
// ): SchemaToWebBackendApiCodeInput {
//   const schemas = readSchemas(
//     tree,
//     path.join(normalizedOptions.dataModelProjectRoot, 'assets/schemas')
//   );
//
//   return {
//     schemas,
//     options: {
//       appsMonorepo: {
//         npmScope: '',
//         libsDir: '',
//         baseProjectName: ''
//       },
//       interfacePrefixes: {
//         db: 'db',
//         app: '',
//       },
//     },
//   };
// }
