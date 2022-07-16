import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../../schema';
import { LibraryGeneratorSchema as JsLibSchema } from '@nrwl/js/src/utils/schema';
import { PROJECT_SUFFIX_LIB_SHARED } from '../../../../shared/constants';
import { libraryGenerator as generateJsLib } from '@nrwl/js/src/generators/library/library';
import { getProjectRoot } from '@gmnx/internal-util';
import path from 'path';
import { SharedLibraryCodeGeneratorSchema } from '../../../shared-library-code/schema';
import { generateSharedLibraryCode } from '../../../shared-library-code/generator';

export async function generateSharedLib(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // @nrwl/js:library
  const jsLibSchema: JsLibSchema = {
    name: options.name + PROJECT_SUFFIX_LIB_SHARED,
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
