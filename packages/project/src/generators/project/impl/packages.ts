import { addDependenciesToPackageJson, Tree } from '@nrwl/devkit';

const VERSION_MONGODB = '4.7.0';

const VERSION_TYPE_FEST = '2.14.0';
const VERSION_TAILWIND_CSS = '';
const VERSION_POSTCSS = '';
const VERSION_AUTOPREFIXER = '';

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
