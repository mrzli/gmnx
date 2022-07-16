import { Tree } from '@nrwl/devkit';
import { NormalizedSchema, readProjectJsonSchemas } from '../../shared/util';
import {
  schemaToBackendAppCode,
  SchemaToBackendAppCodeInput,
} from '@gmjs/data-manipulation';
import { readText, writeTexts } from '@gmnx/internal-util';
import path from 'path';

export async function generateModules(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const input: SchemaToBackendAppCodeInput = {
    schemas: readProjectJsonSchemas(tree, options),
    initialFiles: {
      appModule: readText(
        tree,
        path.join(options.projects.backend.projectRoot, 'src/app/app.module.ts')
      ),
    },
    options: {
      appsMonorepo: options,
      interfacePrefixes: options.interfacePrefixes,
    },
  };
  const backendAppCode = schemaToBackendAppCode(input);
  writeTexts(
    tree,
    path.join(options.projects.backend.projectRoot, 'src'),
    backendAppCode
  );
}
