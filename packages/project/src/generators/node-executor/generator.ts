import {
  formatFiles,
  readProjectConfiguration,
  Tree,
  updateProjectConfiguration,
} from '@nrwl/devkit';
import { NodeExecutorGeneratorSchema } from './schema';

export async function generateNodeExecutor(
  tree: Tree,
  options: NodeExecutorGeneratorSchema
): Promise<void> {
  const project = readProjectConfiguration(tree, options.project);
  project.targets = project.targets || {};
  project.targets[options.name] = {
    executor: '@nrwl/node:node',
    options: {
      buildTarget: `${options.project}:build`,
      watch: false,
      inspect: false,
      args: options.args ? options.args.split(',') : undefined,
    },
  };
  updateProjectConfiguration(tree, options.project, project);

  await formatFiles(tree);
}

export default generateNodeExecutor;
