import { createTreeWithEmptyWorkspace } from '@nrwl/devkit/testing';
import { readProjectConfiguration } from '@nrwl/devkit';

import generator from './generator';
import { ExamplePluginGeneratorSchema } from './schema';

describe.skip('example-plugin generator', () => {
  const options: ExamplePluginGeneratorSchema = { name: 'test' };

  it('should run successfully', async () => {
    const appTree = createTreeWithEmptyWorkspace();
    await generator(appTree, options);
    const config = readProjectConfiguration(appTree, 'test');
    expect(config).toBeDefined();
  });
});
