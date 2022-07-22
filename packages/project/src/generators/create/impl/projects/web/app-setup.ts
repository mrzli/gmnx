import { NormalizedSchema } from '../../shared/util';
import { Tree } from '@nrwl/devkit';
import { webAppSetup, WebAppSetupInput } from '@gmjs/data-manipulation';
import { writeTexts } from '@gmnx/internal-util';
import path from 'path';

export async function generateAppSetup(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  const input: WebAppSetupInput = {
    options,
  };
  const appSetupCode = webAppSetup(input);
  writeTexts(
    tree,
    path.join(options.projects.web.projectRoot, 'src'),
    appSetupCode
  );
}
