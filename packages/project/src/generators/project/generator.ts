import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from './schema';
import generateDataModel from '../data-model/generator';
import generateSchema from '../schemas/generator';

const DATA_MODEL_PROJECT_SUFFIX = '-data-model';

export async function generateProject(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  await generateDataModel(tree, {
    name: options.name + DATA_MODEL_PROJECT_SUFFIX,
    directory: options.directory,
    tags: '',
  });

  await generateSchema(tree, {
    name: options.name + DATA_MODEL_PROJECT_SUFFIX,
    directory: options.directory,
  });
}

export default generateProject;
