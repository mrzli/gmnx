import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import { generateWorkspaceProject } from './generator';
import { WorkspaceProjectGeneratorSchema } from './schema';

describe('workspaceProject generator', () => {
  let appTree: Tree;
  const options: WorkspaceProjectGeneratorSchema = { name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generateWorkspaceProject(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
