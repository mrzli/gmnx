import { Tree } from '@nrwl/devkit';
import { NormalizedSchema, readProjectJsonSchemas } from '../../shared/util';
import {
  schemaToWebBackendApiCode,
  SchemaToWebBackendApiCodeInput,
} from '@gmjs/data-manipulation';
import { writeTexts } from '@gmnx/internal-util';
import path from 'path';

export async function generateBackendApi(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const input: SchemaToWebBackendApiCodeInput = {
    schemas: readProjectJsonSchemas(tree, options),
    options: {
      appsMonorepo: options,
      interfacePrefixes: options.interfacePrefixes,
    },
  };
  const backendCode = schemaToWebBackendApiCode(input);
  writeTexts(
    tree,
    path.join(options.projects.web.projectRoot, 'src'),
    backendCode
  );
}
