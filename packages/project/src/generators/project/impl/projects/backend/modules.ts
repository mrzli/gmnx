import { Tree } from '@nrwl/devkit';
import { generateBackendAppCode } from '../../../../backend-app-code/generator';
import { BackendAppCodeGeneratorSchema } from '../../../../backend-app-code/schema';
import { NormalizedSchema } from '../../shared/util';

export async function generateModules(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const backendAppCodeSchema: BackendAppCodeGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateBackendAppCode(tree, backendAppCodeSchema);
}
