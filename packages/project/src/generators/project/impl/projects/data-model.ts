import { Tree } from '@nrwl/devkit';
import { DataModelGeneratorSchema } from '../../../data-model/schema';
import { SchemasGeneratorSchema } from '../../../schemas/schema';
import { generateSchemas } from '../../../schemas/generator';
import { generateDataModel as generateDataModelInternal } from '../../../data-model/generator';
import { NormalizedSchema } from '../shared/util';

export async function generateDataModel(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const dataModelSchema: DataModelGeneratorSchema = {
    name: options.name,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:util`,
  };
  await generateDataModelInternal(tree, dataModelSchema);

  const schemasSchema: SchemasGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateSchemas(tree, schemasSchema);
}
