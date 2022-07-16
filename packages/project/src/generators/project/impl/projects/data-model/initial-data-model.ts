import { NormalizedSchema } from '../../shared/util';
import { Tree } from '@nrwl/devkit';
import { DataModelGeneratorSchema } from '../../../../data-model/schema';
import { generateDataModel as generateDataModelInternal } from '../../../../data-model/generator';

export async function generateInitialDataModel(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const dataModelSchema: DataModelGeneratorSchema = {
    name: options.name,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:util`,
  };
  await generateDataModelInternal(tree, dataModelSchema);
}
