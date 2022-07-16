import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import {
  addMongoDatabaseToBackend,
  AddMongoDatabaseToBackendInput,
} from '@gmjs/data-manipulation';
import { readText, writeText } from '@gmnx/internal-util';
import path from 'path';

export async function generateMongoDatabase(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const appModulePath = path.join(
    options.projects.backend.projectRoot,
    'src/app/app.module.ts'
  );

  const input: AddMongoDatabaseToBackendInput = {
    appModuleFile: readText(tree, appModulePath),
    options,
  };

  const appModuleFile = addMongoDatabaseToBackend(input);
  writeText(tree, appModulePath, appModuleFile);
}
