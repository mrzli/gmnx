import { NormalizedSchema } from '../../shared/util';
import { Tree } from '@nrwl/devkit';
import { CliAppCodeGeneratorSchema } from '../../../../cli-app-code/schema';
import { generateCliAppCode } from '../../../../cli-app-code/generator';

export async function generateCliCode(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const cliAppCodeSchema: CliAppCodeGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateCliAppCode(tree, cliAppCodeSchema);
}
