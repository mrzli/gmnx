import { Tree } from '@nrwl/devkit';
import { PostmanCollectionGeneratorSchema } from '../../../postman-collection/schema';
import { generatePostmanCollection as generatePostmanCollectionInternal } from '../../../postman-collection/generator';
import { NormalizedSchema } from '../shared/util';

export async function generatePostmanCollection(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const postmanCollectionSchema: PostmanCollectionGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generatePostmanCollectionInternal(tree, postmanCollectionSchema);
}
