import { Tree } from '@nrwl/devkit';
import { NormalizedSchema, readProjectJsonSchemas } from '../../shared/util';
import { writeTexts } from '@gmnx/internal-util';
import path from 'path';
import {
  schemaToWebActionReducerCode,
  SchemaToWebActionReducerCodeInput,
} from '@gmjs/data-manipulation';

export async function generateActionsReducers(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const input: SchemaToWebActionReducerCodeInput = {
    schemas: readProjectJsonSchemas(tree, options),
    options,
  };
  const actionsReducersCode = schemaToWebActionReducerCode(input);
  writeTexts(
    tree,
    path.join(options.projects.web.projectRoot, 'src'),
    actionsReducersCode
  );
}
