import { formatFiles, generateFiles, Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../schema';
import { Schema as ReactAppSchema } from '@nrwl/react/src/generators/application/schema';
import { PROJECT_SUFFIX_APP_WEB } from '../../../shared/constants';
import { Linter } from '@nrwl/linter';
import { applicationGenerator as generateReactApp } from '@nrwl/react/src/generators/application/application';
import {
  execCommand,
  getProjectRoot as getProjectRootInternal,
  readText,
  writeText,
} from '@gmnx/internal-util';
import path from 'path';

export async function generateWeb(
  tree: Tree,
  options: ProjectGeneratorSchema,
  dryRun: boolean
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
  await generateReactApp(tree, reactAppSchema);

  cleanProject(tree, reactAppSchema);

  addFiles(tree, reactAppSchema);

  await setupTailwind(tree, reactAppSchema, dryRun);

  await formatFiles(tree);
}

function cleanProject(tree: Tree, options: ReactAppSchema): void {
  const projectRoot = getProjectRoot(tree, options);
  tree.delete(path.join(projectRoot, 'src/main.tsx'));
  tree.delete(path.join(projectRoot, 'src/app'));
}

function addFiles(tree: Tree, options: ReactAppSchema): void {
  const projectRoot = getProjectRoot(tree, options);
  generateFiles(tree, path.join(__dirname, '../files/web'), projectRoot, {
    template: '',
  });
}

function getProjectRoot(tree: Tree, options: ReactAppSchema): string {
  return getProjectRootInternal(tree, options, true, undefined);
}

async function setupTailwind(
  tree: Tree,
  options: ReactAppSchema,
  dryRun: boolean
): Promise<void> {
  if (dryRun) {
    return;
  }

  const projectRoot = getProjectRoot(tree, options);

  await execCommand(
    'npm install -D tailwindcss@latest postcss@latest autoprefixer@latest'
  );
  await execCommand(`cd ${projectRoot} & npx tailwindcss init -p`);

  const stylesFilePath = path.join(projectRoot, 'src/styles.scss');
  const stylesFile = readText(tree, stylesFilePath);
  const updatedStylesFile = stylesFile.concat(
    [
      '',
      '@tailwind components;',
      '@tailwind base;',
      '@tailwind utilities;',
    ].join('\n')
  );

  writeText(tree, stylesFilePath, updatedStylesFile);
}
