import { Tree } from '@nrwl/devkit';
import { MongoJsonSchemaTypeObject } from '@gmjs/data-manipulation';
import { readTextsByExtension } from '@gmnx/internal-util';
import { textToJson } from '@gmjs/lib-util';

export function readSchemas(
  tree: Tree,
  dirPath: string
): readonly MongoJsonSchemaTypeObject[] {
  return readTextsByExtension(tree, dirPath, 'json').map((file) =>
    textToJson<MongoJsonSchemaTypeObject>(file.content)
  );
}
