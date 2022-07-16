import { Tree } from '@nrwl/devkit';
import { MongoDatabaseToBackendCodeAdditionGeneratorSchema } from '../../../../mongo-database-to-backend-code-addition/schema';
import generateMongoDatabaseToBackendCodeAddition from '../../../../mongo-database-to-backend-code-addition/generator';
import { NormalizedSchema } from '../../shared/util';

export async function generateMongoDatabase(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const addMongoDatabaseToBackendSchema: MongoDatabaseToBackendCodeAdditionGeneratorSchema =
    {
      name: options.name,
      directory: options.directory,
    };
  await generateMongoDatabaseToBackendCodeAddition(
    tree,
    addMongoDatabaseToBackendSchema
  );
}
