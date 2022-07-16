import { addDependenciesToPackageJson, Tree, updateJson } from '@nrwl/devkit';
import { PROJECT_PACKAGES } from '../shared/package-versions';
import { invariant, objectPickFields } from '@gmjs/util';
import {
  configToOverridesMap,
  EslintConfig,
  getModuleBoundariesOptions,
} from '@gmnx/internal-util';
import { kebabCase } from '@gmjs/lib-util';
import { NormalizedSchema } from '../shared/util';

const ESLINT_CONFIG_FILE_PATH = '.eslintrc.json';

export async function setupWorkspace(
  tree: Tree,
  options: NormalizedSchema
): Promise<void> {
  await installPackages(tree);
  updateEslint(tree, options);
}

async function installPackages(tree: Tree): Promise<void> {
  await addDependenciesToPackageJson(
    tree,
    objectPickFields(PROJECT_PACKAGES, ['axios', 'mongodb']),
    objectPickFields(PROJECT_PACKAGES, ['type-fest'])
  );
}

function updateEslint(tree: Tree, options: NormalizedSchema): void {
  updateJson(tree, ESLINT_CONFIG_FILE_PATH, (eslintConfigJson) => {
    updateEslintConfig(eslintConfigJson, options);
    return eslintConfigJson;
  });
}

function updateEslintConfig(
  eslintConfigJson: EslintConfig,
  options: NormalizedSchema
): void {
  const overridesMap = configToOverridesMap(eslintConfigJson);
  const overrideAll = overridesMap.getOrThrow('all');
  const moduleBoundariesOptions = getModuleBoundariesOptions(overrideAll);
  invariant(
    !!moduleBoundariesOptions,
    'Expected to find module boundary options.'
  );

  const projectAppTagName = getProjectAppTagName(options.name);
  const depConstraints = moduleBoundariesOptions.depConstraints;
  if (!depConstraints.some((dc) => dc.sourceTag === projectAppTagName)) {
    moduleBoundariesOptions.depConstraints = [
      {
        sourceTag: projectAppTagName,
        onlyDependOnLibsWithTags: [projectAppTagName, 'app:shared'],
      },
      ...depConstraints,
    ];
  }
}

function getProjectAppTagName(projectBaseName: string): string {
  return `app:${kebabCase(projectBaseName)}`;
}
