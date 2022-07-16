import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../../schema';
import { PostmanCollectionGeneratorSchema } from '../../../postman-collection/schema';
import { generatePostmanCollection as generatePostmanCollectionInternal } from '../../../postman-collection/generator';

export async function generatePostmanCollection(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  const postmanCollectionSchema: PostmanCollectionGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generatePostmanCollectionInternal(tree, postmanCollectionSchema);
}
