import path from 'path';
import { NormalizedSchema, readProjectJsonSchemas } from '../../shared/util';
import { Tree } from '@nrwl/devkit';
import {
  schemaToSharedLibraryCode,
  SchemaToSharedLibraryCodeInput,
} from '@gmjs/data-manipulation';
import { readText, writeTexts } from '@gmnx/internal-util';

export async function generateSharedLibCode(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const input: SchemaToSharedLibraryCodeInput = {
    schemas: readProjectJsonSchemas(tree, options),
    initialFiles: {
      index: readText(
        tree,
        path.join(options.projects.sharedLib.projectRoot, 'src/index.ts')
      ),
    },
    options: {
      interfacePrefixes: options.interfacePrefixes,
    },
  };
  const sharedLibraryCode = schemaToSharedLibraryCode(input);
  writeTexts(
    tree,
    path.join(options.projects.sharedLib.projectRoot, 'src'),
    sharedLibraryCode
  );
}
