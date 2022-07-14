import { generateProjectPackagesVersionUpdate } from './generator';
import { ProjectPackagesVersionUpdateGeneratorSchema } from './schema';
import { FsTree } from 'nx/src/generators/tree';

describe.skip('project-packages-version-update generator', () => {
  const options: ProjectPackagesVersionUpdateGeneratorSchema = {
    name: 'project',
    projectPackagesFilePath:
      'src/generators/project/impl/shared/package-versions.ts',
  };

  it('should run successfully', async () => {
    const tree = new FsTree('.', false);
    await generateProjectPackagesVersionUpdate(tree, options);
  });
});
