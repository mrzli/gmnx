import {
  addDependenciesToPackageJson,
  generateFiles,
  Tree,
} from '@nrwl/devkit';
import path from 'path';
import { NormalizedSchema, pathRelativeToFiles } from '../../shared/util';
import { readText, writeText } from '@gmnx/internal-util';
import { stringArrayToLines } from '@gmjs/lib-util';
import { objectPickFields } from '@gmjs/util';
import { PROJECT_PACKAGES } from '../../shared/package-versions';

export async function setupTailwind(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const projectRoot = options.projects.web.projectRoot;

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
