import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import { LibraryGeneratorSchema } from '@nrwl/js/src/utils/schema';
import { libraryGenerator } from '@nrwl/js';

export async function generateLibrary(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  // @nrwl/js:library
  const jsLibSchema: LibraryGeneratorSchema = {
    name: options.projects.sharedLib.projectBaseName,
    directory: options.directory,
    tags: `app:${options.name},scope:shared,type:util`,
  };
  await libraryGenerator(tree, jsLibSchema);
}
