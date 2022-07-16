import { NormalizedSchema } from '../../shared/util';
import { Tree } from '@nrwl/devkit';
import { SchemasGeneratorSchema } from '../../../../schemas/schema';
import { generateSchemas as generateSchemasInternal } from '../../../../schemas/generator';

export async function generateSchemas(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const schemasSchema: SchemasGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateSchemasInternal(tree, schemasSchema);
}
