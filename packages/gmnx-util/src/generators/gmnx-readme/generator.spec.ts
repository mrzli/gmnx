import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import { generateGmnxReadme } from './generator';
import { FsTree } from 'nx/src/generators/tree';

describe.skip('gmnx-readme generator', () => {
  let appTree: Tree;

  beforeEach(() => {
    // appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    appTree = new FsTree('.', false);
    await generateGmnxReadme(appTree);
    // const config = readProjectConfiguration(appTree, 'test');
    // expect(config).toBeDefined();
  });
});
