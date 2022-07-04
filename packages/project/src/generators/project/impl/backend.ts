import { Tree } from '@nrwl/devkit';
import { ProjectGeneratorSchema } from '../schema';
import { ApplicationGeneratorOptions as NestAppSchema } from '@nrwl/nest/src/generators/application/schema';
import {
  PROJECT_SUFFIX_APP_BACKEND,
  PROJECT_SUFFIX_APP_WEB,
} from '../../../shared/constants';
import { applicationGenerator as generateNestApp } from '@nrwl/nest/src/generators/application/application';
import { AddMongoDatabaseToBackendGeneratorSchema } from '../../add-mongo-database-to-backend/schema';
import generateAddMongoDatabaseToBackend from '../../add-mongo-database-to-backend/generator';
import { BackendAppCodeGeneratorSchema } from '../../backend-app-code/schema';
import { generateBackendAppCode } from '../../backend-app-code/generator';

export async function generateBackend(
  tree: Tree,
  options: ProjectGeneratorSchema
): Promise<void> {
  // @nrwl/nest:application
  const nestAppSchema: NestAppSchema = {
    name: options.name + PROJECT_SUFFIX_APP_BACKEND,
    directory: options.directory,
    tags: `app:${options.name},scope:backend,type:app`,
    frontendProject: options.name + PROJECT_SUFFIX_APP_WEB,
  };
  await generateNestApp(tree, nestAppSchema);

  const addMongoDatabaseToBackendSchema: AddMongoDatabaseToBackendGeneratorSchema =
    {
      name: options.name,
      directory: options.directory,
    };
  await generateAddMongoDatabaseToBackend(
    tree,
    addMongoDatabaseToBackendSchema
  );

  const backendAppCodeSchema: BackendAppCodeGeneratorSchema = {
    name: options.name,
    directory: options.directory,
  };
  await generateBackendAppCode(tree, backendAppCodeSchema);
}
