import { getWorkspaceLayout, Tree } from '@nrwl/devkit';
import path from 'path';
import { ProjectGeneratorSchema } from '../../schema';
import {
  getProjectNameWithoutDir,
  getProjectValues,
  ProjectValues,
} from '@gmnx/internal-util';
import {
  PROJECT_SUFFIX_APP_BACKEND,
  PROJECT_SUFFIX_APP_CLI,
  PROJECT_SUFFIX_APP_WEB,
  PROJECT_SUFFIX_LIB_DATA_MODEL,
  PROJECT_SUFFIX_LIB_SHARED,
} from '../../../../shared/constants';

export function pathRelativeToFiles(
  ...pathSegments: readonly string[]
): string {
  return path.join(__dirname, '../../files', ...pathSegments);
}

export interface NormalizedSchema extends ProjectGeneratorSchema {
  readonly npmScope: string;
  readonly libsDir: string;
  readonly baseProjectName: string;
  readonly projects: AllProjectValues;
}

export interface AllProjectValues {
  readonly dataModel: ProjectValues;
  readonly sharedLib: ProjectValues;
  readonly cli: ProjectValues;
  readonly backend: ProjectValues;
  readonly web: ProjectValues;
}

export function normalizeOptions(
  tree: Tree,
  options: ProjectGeneratorSchema
): NormalizedSchema {
  return {
    ...options,
    ...getWorkspaceLayout(tree),
    baseProjectName: getProjectNameWithoutDir(options.name),
    projects: {
      dataModel: getProjectValues(
        tree,
        options,
        false,
        PROJECT_SUFFIX_LIB_DATA_MODEL
      ),
      sharedLib: getProjectValues(
        tree,
        options,
        false,
        PROJECT_SUFFIX_LIB_SHARED
      ),
      cli: getProjectValues(tree, options, true, PROJECT_SUFFIX_APP_CLI),
      backend: getProjectValues(
        tree,
        options,
        true,
        PROJECT_SUFFIX_APP_BACKEND
      ),
      web: getProjectValues(tree, options, true, PROJECT_SUFFIX_APP_WEB),
    },
  };
}
