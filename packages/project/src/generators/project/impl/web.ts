import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
} from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../schema';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { PROJECT_SUFFIX_APP_WEB } from '../../../shared/constants';
import { Linter } from '@nrwl/linter';
import { applicationGenerator as generateReactAppInternal } from '@nrwl/react/src/generators/application/application';
import {
  deleteFiles,
  getProjectRoot as getProjectRootInternal,
  readText,
  writeText,
} from '@gmnx/internal-util';
import path from 'path';
import {
  VERSION_AUTOPREFIXER,
  VERSION_POSTCSS,
  VERSION_TAILWINDCSS,
} from './shared/package-versions';
import { stringArrayToLines } from '@gmjs/lib-util';

export async function generateWeb(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  await generateReactApp(tree, options);
  cleanProject(tree, options);
  await setupTailwind(tree, options);
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

  generateFiles(tree, path.join(__dirname, '../files/web/clean'), projectRoot, {
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

  generateFiles(
    tree,
    path.join(__dirname, '../files/web/tailwind'),
    projectRoot,
    {
      template: '',
    }
  );

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
    {
      tailwindcss: VERSION_TAILWINDCSS,
      postcss: VERSION_POSTCSS,
      autoprefixer: VERSION_AUTOPREFIXER,
    }
  );
}
