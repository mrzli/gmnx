import { Tree, updateJson } from '@nrwl/devkit';
import { invariant } from '@gmjs/util';
import {
  configToOverridesMap,
  EslintConfig,
  getModuleBoundariesOptions,
} from '@gmnx/internal-util';
import { RemoveGeneratorSchema } from '../schema';
import { kebabCase } from '@gmjs/lib-util';

const ESLINT_CONFIG_FILE_PATH = '.eslintrc.json';

export async function cleanWorkspace(
  tree: Tree,
  options: RemoveGeneratorSchema
): Promise<void> {
  updateEslint(tree, options);
}

function updateEslint(tree: Tree, options: RemoveGeneratorSchema): void {
  updateJson(tree, ESLINT_CONFIG_FILE_PATH, (eslintConfigJson) => {
    updateEslintConfig(eslintConfigJson, options);
    return eslintConfigJson;
  });
}

function updateEslintConfig(
  eslintConfigJson: EslintConfig,
  options: RemoveGeneratorSchema
): void {
  const overridesMap = configToOverridesMap(eslintConfigJson);
  const overrideAll = overridesMap.getOrThrow('all');
  const moduleBoundariesOptions = getModuleBoundariesOptions(overrideAll);
  invariant(
    !!moduleBoundariesOptions,
    'Expected to find module boundary options.'
  );

  const projectAppTagName = getProjectAppTagName(options.name);
  moduleBoundariesOptions.depConstraints =
    moduleBoundariesOptions.depConstraints.filter(
      (dc) => dc.sourceTag !== projectAppTagName
    );
}

function getProjectAppTagName(projectBaseName: string): string {
  return `app:${kebabCase(projectBaseName)}`;
}
