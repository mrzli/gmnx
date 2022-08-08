import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import { generateNodeExecutor } from './generator';
import { NodeExecutorGeneratorSchema } from './schema';

describe.skip('node-executor generator', () => {
  let appTree: Tree;
  const options: NodeExecutorGeneratorSchema = { project: 'test', name: 'test' };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generateNodeExecutor(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
