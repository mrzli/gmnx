import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from './schema';
import generateDataModel from '../data-model/generator';
import generateSchema from '../schemas/generator';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  await generateDataModel(tree, {
    name: options.name,
    directory: options.directory,
    tags: '',
  });

  await generateSchema(tree, {
    name: options.name,
    directory: options.directory,
  });
}

export default generateProject;
