import { generateFiles, Tree, updateJson } from '@nrwl/devkit';
import path from 'path';
import {
  AnyObject,
  AnyValue,
  isArray,
  isArrayWithPrimitivesEqual,
  isObject,
  ReadonlyRecord,
  sortArrayByStringAsc,
} from '@gmjs/util';

const ESLINT_CONFIG_FILE_PATH = '.eslintrc.json';

export async function generateEslintConfigUpdates(tree: Tree): Promise<void> {
  if (!tree.exists(ESLINT_CONFIG_FILE_PATH)) {
    generateFiles(tree, path.join(__dirname, 'files'), '', { template: '' });
  } else {
    updateJson(tree, ESLINT_CONFIG_FILE_PATH, (eslintConfigJson) => {
      updateModuleBoundariesRule(eslintConfigJson);
      return eslintConfigJson;
    });
  }
}

function updateModuleBoundariesRule(eslintConfigJson: AnyValue): void {
  const overrides = eslintConfigJson.overrides ?? [];
  let foundOverrideX = false;

  for (const override of overrides) {
    override.rules ??= {};
    const rules = override.rules;

    if (isOverrideFilesEqual(override, OVERRIDE_FILES_ALL)) {
      const enforceModuleBoundariesRule =
        rules[RULE_KEY_ENFORCE_MODULE_BOUNDARIES];
      if (
        enforceModuleBoundariesRule &&
        isArray(enforceModuleBoundariesRule) &&
        enforceModuleBoundariesRule.length >= 2 &&
        isObject(enforceModuleBoundariesRule[1])
      ) {
        if (enforceModuleBoundariesRule[1].depConstraints.length <= 1) {
          enforceModuleBoundariesRule[1].depConstraints = DEP_CONSTRAINTS;
        }
      } else {
        rules[RULE_KEY_ENFORCE_MODULE_BOUNDARIES] =
          RULE_ENFORCE_MODULE_BOUNDARIES_RULE;
      }
    } else if (isOverrideFilesEqual(override, OVERRIDE_FILES_TS)) {
      rules[RULE_KEY_EXPLICIT_FUNCTION_RETURN_TYPE] ??=
        RULE_EXPLICIT_FUNCTION_RETURN_TYPE;
      rules[RULE_KEY_EXPLICIT_MEMBER_ACCESSIBILITY] ??=
        RULE_EXPLICIT_MEMBER_ACCESSIBILITY;
      rules[RULE_KEY_NO_UNUSED_VARS] ??= RULE_NO_UNUSED_VARS;
    } else if (isOverrideFilesEqual(override, OVERRIDE_FILES_X)) {
      foundOverrideX = true;
      rules[RULE_KEY_JSX_BOOLEAN_VALUE] ??= RULE_JSX_BOOLEAN_VALUE;
      rules[RULE_KEY_JSX_CURLY_BRACE_PRESENCE] ??=
        RULE_JSX_CURLY_BRACE_PRESENCE;
    }
  }

  if (!foundOverrideX) {
    overrides.push(OVERRIDE_X);
  }
}

function isOverrideFilesEqual(
  override: AnyValue,
  compareTo: readonly string[]
): boolean {
  return (
    override.files &&
    isArray(override.files) &&
    isArrayWithPrimitivesEqual(
      sortArrayByStringAsc(override.files),
      sortArrayByStringAsc(compareTo)
    )
  );
}

const OVERRIDE_FILES_ALL: readonly string[] = [
  '*.ts',
  '*.tsx',
  '*.js',
  '*.jsx',
];

const OVERRIDE_FILES_TS: readonly string[] = ['*.ts', '*.tsx'];

// const OVERRIDE_FILES_JS: readonly string[] = ['*.js', '*.jsx'];

const OVERRIDE_FILES_X: readonly string[] = ['*.tsx', '*.jsx'];

interface DepConstraint {
  readonly sourceTag: string;
  readonly onlyDependOnLibsWithTags: readonly string[];
}

const DEP_CONSTRAINTS: readonly DepConstraint[] = [
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

const RULE_KEY_ENFORCE_MODULE_BOUNDARIES = '@nrwl/nx/enforce-module-boundaries';
const RULE_KEY_EXPLICIT_FUNCTION_RETURN_TYPE =
  '@typescript-eslint/explicit-function-return-type';
const RULE_KEY_EXPLICIT_MEMBER_ACCESSIBILITY =
  '@typescript-eslint/explicit-member-accessibility';
const RULE_KEY_NO_UNUSED_VARS = '@typescript-eslint/no-unused-vars';
const RULE_KEY_JSX_BOOLEAN_VALUE = 'react/jsx-boolean-value';
const RULE_KEY_JSX_CURLY_BRACE_PRESENCE = 'react/jsx-curly-brace-presence';

type Rule = readonly [string, (string | AnyObject)?];

const RULE_ENFORCE_MODULE_BOUNDARIES_RULE: Rule = [
  'error',
  {
    enforceBuildableLibDependency: true,
    allow: [],
    depConstraints: DEP_CONSTRAINTS,
  },
];

const RULE_EXPLICIT_FUNCTION_RETURN_TYPE: Rule = [
  'error',
  {
    allowExpressions: true,
  },
];

const RULE_EXPLICIT_MEMBER_ACCESSIBILITY: Rule = ['error'];

const RULE_NO_UNUSED_VARS: Rule = [
  'warn',
  {
    argsIgnorePattern: '^_',
    destructuredArrayIgnorePattern: '^_',
    ignoreRestSiblings: true,
  },
];

const RULE_JSX_BOOLEAN_VALUE: Rule = ['error', 'always'];

const RULE_JSX_CURLY_BRACE_PRESENCE: Rule = [
  'error',
  {
    props: 'always',
    children: 'ignore',
  },
];

interface Override {
  readonly files: readonly string[];
  readonly extends: readonly string[];
  readonly rules: ReadonlyRecord<string, Rule>;
}

const OVERRIDE_X: Override = {
  files: OVERRIDE_FILES_X,
  extends: [],
  rules: {
    [RULE_KEY_JSX_BOOLEAN_VALUE]: RULE_JSX_BOOLEAN_VALUE,
    [RULE_KEY_JSX_CURLY_BRACE_PRESENCE]: RULE_JSX_CURLY_BRACE_PRESENCE,
  },
};

export default generateEslintConfigUpdates;
