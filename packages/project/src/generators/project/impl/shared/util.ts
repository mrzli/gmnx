import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import path from 'path';
import { ProjectGeneratorSchema } from '../../schema';
import { getProjectNameWithoutDir } from '@gmnx/internal-util';

export function pathRelativeToFiles(
  ...pathSegments: readonly string[]
): string {
  return path.join(__dirname, '../../files', ...pathSegments);
}

export interface NormalizedSchema extends ProjectGeneratorSchema {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseProjectName: string;
}

export function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    ...getWorkspaceLayout(tree),
    baseProjectName: getProjectNameWithoutDir(options.name),
  };
}
