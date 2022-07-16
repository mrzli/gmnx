import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../../schema';
import { Schema as NodeAppSchema } from '@nrwl/node/src/generators/application/schema';
import {
  PROJECT_SUFFIX_APP_CLI,
  PROJECT_SUFFIX_APP_WEB,
} from '../../../../shared/constants';
import { applicationGenerator as generateNodeApp } from '@nrwl/node/src/generators/application/application';
import { CliAppCodeGeneratorSchema } from '../../../cli-app-code/schema';
import { generateCliAppCode } from '../../../cli-app-code/generator';

export async function generateCli(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // @nrwl/node:application
  const nodeAppSchema: NodeAppSchema = {
    name: options.name + PROJECT_SUFFIX_APP_CLI,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:app`,
    frontendProject: options.name + PROJECT_SUFFIX_APP_WEB,
  };
  await generateNodeApp(tree, nodeAppSchema);

  const cliAppCodeSchema: CliAppCodeGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateCliAppCode(tree, cliAppCodeSchema);
}
