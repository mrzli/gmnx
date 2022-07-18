import { Tree } from '@nrwl/devkit';
import { NormalizedSchema, readProjectJsonSchemas } from '../../shared/util';
import { schemaToWebActionReducerCode } from '@gmjs/data-manipulation/src/lib/schema/to-web-action-reducer-code/schema-to-web-action-reducer-code';
import { SchemaToWebActionReducerCodeInput } from '@gmjs/data-manipulation/src/lib/schema/to-web-action-reducer-code/schema-to-web-action-reducer-code-input';
import { writeTexts } from '@gmnx/internal-util';
import path from 'path';

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
