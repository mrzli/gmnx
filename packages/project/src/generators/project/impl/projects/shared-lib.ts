import { Tree } from '@nrwl/devkit';
import { LibraryGeneratorSchema as JsLibSchema } from '@nrwl/js/src/utils/schema';
import { libraryGenerator as generateJsLib } from '@nrwl/js/src/generators/library/library';
import { getProjectRoot } from '@gmnx/internal-util';
import path from 'path';
import { SharedLibraryCodeGeneratorSchema } from '../../../shared-library-code/schema';
import { generateSharedLibraryCode } from '../../../shared-library-code/generator';
import { NormalizedSchema } from '../shared/util';

export async function generateSharedLib(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  // @nrwl/js:library
  const jsLibSchema: JsLibSchema = {
    name: options.projects.sharedLib.projectBaseName,
    directory: options.directory,
    tags: `app:${options.name},scope:shared,type:util`,
  };
  await generateJsLib(tree, jsLibSchema);
  cleanProject(tree, jsLibSchema);

  const sharedLibraryCodeSchema: SharedLibraryCodeGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateSharedLibraryCode(tree, sharedLibraryCodeSchema);
}

function cleanProject(tree: Tree, options: JsLibSchema): void {
  const projectRoot = getProjectRoot(tree, options, false, undefined);
  tree.delete(path.join(projectRoot, 'src/lib'));
  tree.write(path.join(projectRoot, 'src/index.ts'), '');
}
