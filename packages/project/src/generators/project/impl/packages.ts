import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

const VERSION_MONGODB = '4.7.0';

const VERSION_TYPE_FEST = '2.14.0';

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
