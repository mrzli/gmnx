import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';
import { VERSION_MONGODB, VERSION_TYPE_FEST } from './shared/package-versions';

export async function installPackages(tree: Tree): Promise<void> {
  await addDependenciesToPackageJson(
    tree,
    {
      mongodb: VERSION_MONGODB,
    },
    {
      'type-fest': VERSION_TYPE_FEST,
    }
  );
}
