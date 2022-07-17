import { Tree } from '@nrwl/devkit';
import { NormalizedSchema } from '../../shared/util';
import {
  backendMongoDatabase,
  BackendMongoDatabaseInput,
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

  const input: BackendMongoDatabaseInput = {
    appModuleFile: readText(tree, appModulePath),
    options,
  };

  const appModuleFile = backendMongoDatabase(input);
  writeText(tree, appModulePath, appModuleFile);
}
