import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { Tree, readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { MongoDatabaseToBackendCodeAdditionGeneratorSchema } from './schema';

describe.skip('mongo-database-to-backend-code-addition generator', () => {
  let appTree: Tree;
  const options: MongoDatabaseToBackendCodeAdditionGeneratorSchema = {
    name: 'test',
  };

  beforeEach(() => {
    appTree = createTreeWithEmptyWorkspace();
  });

  it('should run successfully', async () => {
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
