import { NormalizedSchema } from '../../shared/util';
import { Tree } from '@nrwl/devkit';
import { SharedLibraryCodeGeneratorSchema } from '../../../../shared-library-code/schema';
import { generateSharedLibraryCode } from '../../../../shared-library-code/generator';

export async function generateSharedLibCode(
  options: NormalizedSchema,
  tree: Tree
): Promise<void> {
  const sharedLibraryCodeSchema: SharedLibraryCodeGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateSharedLibraryCode(tree, sharedLibraryCodeSchema);
}
