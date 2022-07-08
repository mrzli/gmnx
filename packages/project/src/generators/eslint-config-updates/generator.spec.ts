import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, generateFiles } from '@nrwl/devkit';

import generator from './generator';
import path from 'path';
import { findDirsShallowSync, readTextSync } from '@gmjs/fs-util';
import { readText } from '@gmnx/internal-util';

describe('eslint-config-updates generator', () => {
  const EXAMPLE_ROOT_DIR = path.join(__dirname, 'test-assets/input');
  const EXAMPLE_DIRS = findDirsShallowSync(EXAMPLE_ROOT_DIR);

  const EXPECTED_ESLINT_CONFIG = readTextSync(
    path.join(__dirname, 'test-assets/result/.eslintrc.json.txt')
  );

  EXAMPLE_DIRS.forEach((exampleDir) => {
    it(path.basename(exampleDir.fullPath), async () => {
      const tree = createTestTree(exampleDir.fullPath);
      await generator(tree, {});
      const resultEslintConfig = readText(tree, '.eslintrc.json');
      expect(resultEslintConfig).toEqual(EXPECTED_ESLINT_CONFIG);
    });
  });
});

function createTestTree(filesPath: string): Tree {
  const tree = createTreeWithEmptyWorkspace();
  generateFiles(tree, filesPath, '', {
    template: '',
  });

  return tree;
}
