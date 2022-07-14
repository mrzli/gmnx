import { generateFiles, Tree, updateJson } from '@nrwl/devkit';
import path from 'path';
import {
  EslintConfig,
  EslintDepConstraint,
  EslintOverride,
  EslintRule,
  ESLINT_OVERRIDE_FILES_JSX,
  configToOverridesMap,
  getModuleBoundariesOptions,
  RULE_KEY_ENFORCE_MODULE_BOUNDARIES,
} from '@gmnx/internal-util';

const ESLINT_CONFIG_FILE_PATH = '.eslintrc.json';

export async function generateEslintConfigUpdates(tree: Tree): Promise<void> {
  if (!tree.exists(ESLINT_CONFIG_FILE_PATH)) {
    generateFiles(tree, path.join(__dirname, 'files'), '', { template: '' });
  } else {
    updateJson(
      tree,
      ESLINT_CONFIG_FILE_PATH,
      (eslintConfigJson: EslintConfig) => {
        updateEslintConfig(eslintConfigJson);
        return eslintConfigJson;
      }
    );
  }
}

function updateEslintConfig(eslintConfigJson: EslintConfig): void {
  const overridesMap = configToOverridesMap(eslintConfigJson);
  setInitialModuleBoundariesRule(overridesMap.getOrThrow('all'));
  setInitialTsRules(overridesMap.getOrThrow('ts'));
  setInitialJsxRules(eslintConfigJson.overrides, overridesMap.get('jsx'));
}

function setInitialModuleBoundariesRule(overrideAll: EslintOverride): void {
  const moduleBoundariesOptions = getModuleBoundariesOptions(overrideAll);
  if (moduleBoundariesOptions) {
    if (moduleBoundariesOptions.depConstraints.length <= 1) {
      moduleBoundariesOptions.depConstraints = DEP_CONSTRAINTS;
    }
  } else {
    overrideAll.rules[RULE_KEY_ENFORCE_MODULE_BOUNDARIES] =
      RULE_ENFORCE_MODULE_BOUNDARIES;
  }
}

function setInitialTsRules(overrideTs: EslintOverride): void {
  const rules = overrideTs.rules;

  rules[RULE_KEY_EXPLICIT_FUNCTION_RETURN_TYPE] ??=
    RULE_EXPLICIT_FUNCTION_RETURN_TYPE;
  rules[RULE_KEY_EXPLICIT_MEMBER_ACCESSIBILITY] ??=
    RULE_EXPLICIT_MEMBER_ACCESSIBILITY;
  rules[RULE_KEY_NO_UNUSED_VARS] ??= RULE_NO_UNUSED_VARS;
}

function setInitialJsxRules(
  overrides: EslintOverride[],
  overrideJsx: EslintOverride | undefined
): void {
  if (!overrideJsx) {
    overrides.push(OVERRIDE_JSX);
    return;
  }

  const rules = overrideJsx.rules;

  rules[RULE_KEY_JSX_BOOLEAN_VALUE] ??= RULE_JSX_BOOLEAN_VALUE;
  rules[RULE_KEY_JSX_CURLY_BRACE_PRESENCE] ??= RULE_JSX_CURLY_BRACE_PRESENCE;
}

const DEP_CONSTRAINTS: EslintDepConstraint[] = [
  {
    sourceTag: 'app:shared',
    onlyDependOnLibsWithTags: ['app:shared'],
  },
  {
    sourceTag: 'scope:web',
    onlyDependOnLibsWithTags: ['scope:web', 'scope:shared'],
  },
  {
    sourceTag: 'scope:web-e2e',
    onlyDependOnLibsWithTags: ['scope:web-e2e', 'scope:web', 'scope:shared'],
  },
  {
    sourceTag: 'scope:backend',
    onlyDependOnLibsWithTags: ['scope:backend', 'scope:shared'],
  },
  {
    sourceTag: 'scope:shared',
    onlyDependOnLibsWithTags: ['scope:shared'],
  },
  {
    sourceTag: 'type:app',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:ui',
      'type:data-access',
      'type:util',
    ],
  },
  {
    sourceTag: 'type:feature',
    onlyDependOnLibsWithTags: [
      'type:feature',
      'type:ui',
      'type:data-access',
      'type:util',
    ],
  },
  {
    sourceTag: 'type:ui',
    onlyDependOnLibsWithTags: ['type:ui', 'type:util'],
  },
  {
    sourceTag: 'type:data-access',
    onlyDependOnLibsWithTags: ['type:data-access', 'type:util'],
  },
  {
    sourceTag: 'type:util',
    onlyDependOnLibsWithTags: ['type:util'],
  },
];

const RULE_KEY_EXPLICIT_FUNCTION_RETURN_TYPE =
  '@typescript-eslint/explicit-function-return-type';
const RULE_KEY_EXPLICIT_MEMBER_ACCESSIBILITY =
  '@typescript-eslint/explicit-member-accessibility';
const RULE_KEY_NO_UNUSED_VARS = '@typescript-eslint/no-unused-vars';
const RULE_KEY_JSX_BOOLEAN_VALUE = 'react/jsx-boolean-value';
const RULE_KEY_JSX_CURLY_BRACE_PRESENCE = 'react/jsx-curly-brace-presence';

const RULE_ENFORCE_MODULE_BOUNDARIES: EslintRule = [
  'error',
  {
    enforceBuildableLibDependency: true,
    allow: [],
    depConstraints: DEP_CONSTRAINTS,
  },
];

const RULE_EXPLICIT_FUNCTION_RETURN_TYPE: EslintRule = [
  'error',
  {
    allowExpressions: true,
  },
];

const RULE_EXPLICIT_MEMBER_ACCESSIBILITY: EslintRule = ['error'];

const RULE_NO_UNUSED_VARS: EslintRule = [
  'warn',
  {
    argsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    ignoreRestSiblings: true,
  },
];

const RULE_JSX_BOOLEAN_VALUE: EslintRule = ['error', 'always'];

const RULE_JSX_CURLY_BRACE_PRESENCE: EslintRule = [
  'error',
  {
    props: 'always',
    children: 'ignore',
  },
];

const OVERRIDE_JSX: EslintOverride = {
  files: [...ESLINT_OVERRIDE_FILES_JSX],
  extends: [],
  rules: {
    [RULE_KEY_JSX_BOOLEAN_VALUE]: RULE_JSX_BOOLEAN_VALUE,
    [RULE_KEY_JSX_CURLY_BRACE_PRESENCE]: RULE_JSX_CURLY_BRACE_PRESENCE,
  },
};

export default generateEslintConfigUpdates;
