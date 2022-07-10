import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import { generateWorkspaceInitialSetup } from './generator';

describe.skip('workspace-initial-setup generator', () => {
  let appTree: Tree;
  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generateWorkspaceInitialSetup(appTree);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
