import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import { PROJECT_PACKAGES } from './shared/package-versions';
import { objectPickFields } from '@gmjs/util';

export async function installPackages(tree: Tree): Promise<void> {
  await addDependenciesToPackageJson(
    tree,
    objectPickFields(PROJECT_PACKAGES, ['axios', 'mongodb']),
    objectPickFields(PROJECT_PACKAGES, ['type-fest'])
  );
}
