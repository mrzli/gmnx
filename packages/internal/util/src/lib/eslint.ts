import {
  AnyObject,
  ImmutableMap,
  ImmutableMapTuple,
  invariant,
  isArray,
  isArrayWithPrimitivesEqual,
  isObject,
  sortArrayByStringAsc,
} from '@gmjs/util';
import { jsonToText } from '@gmjs/lib-util';

export interface EslintConfig {
  root: boolean;
  ignorePatterns: string[];
  plugins: string[];
  overrides: EslintOverride[];
}

export interface EslintOverride {
  files: string[];
  extends: string[];
  rules: Record<string, EslintRule>;
}

export type EslintRule = [string, (string | AnyObject)?];

export interface EslintRuleModuleBoundariesOptions {
  enforceBuildableLibDependency: boolean;
  allow: string[];
  depConstraints: EslintDepConstraint[];
}

export interface EslintDepConstraint {
  sourceTag: string;
  onlyDependOnLibsWithTags: string[];
}

export type EslintOverrideType = 'all' | 'ts' | 'js' | 'jsx';

export function configToOverridesMap(
  config: EslintConfig
): ImmutableMap<EslintOverrideType, EslintOverride> {
  const overridesArray: readonly ImmutableMapTuple<
    EslintOverrideType,
    EslintOverride
  >[] = config.overrides
    .filter((o) => isValidOverrideType(o))
    .map((o) => [getOverrideType(o), o]);
  return ImmutableMap.fromTupleArray(overridesArray);
}

function isValidOverrideType(override: EslintOverride): boolean {
  try {
    getOverrideType(override);
    return true;
  } catch {
    return false;
  }
}

function getOverrideType(override: EslintOverride): EslintOverrideType {
  if (isOverrideFilesEqual(override, ESLINT_OVERRIDE_FILES_ALL)) {
    return 'all';
  } else if (isOverrideFilesEqual(override, ESLINT_OVERRIDE_FILES_TS)) {
    return 'ts';
  } else if (isOverrideFilesEqual(override, ESLINT_OVERRIDE_FILES_JS)) {
    return 'js';
  } else if (isOverrideFilesEqual(override, ESLINT_OVERRIDE_FILES_JSX)) {
    return 'jsx';
  } else {
    invariant(
      false,
      `Unrecognized 'override.files' combination in eslint config: '${jsonToText(
        override.files
      )}'.`
    );
  }
}

export const RULE_KEY_ENFORCE_MODULE_BOUNDARIES =
  '@nrwl/nx/enforce-module-boundaries';

export function getModuleBoundariesOptions(
  overrideAll: EslintOverride
): EslintRuleModuleBoundariesOptions | undefined {
  const rules = overrideAll.rules;

  const enforceModuleBoundariesRule = rules[RULE_KEY_ENFORCE_MODULE_BOUNDARIES];
  if (
    enforceModuleBoundariesRule &&
    isArray(enforceModuleBoundariesRule) &&
    enforceModuleBoundariesRule.length >= 2 &&
    isObject(enforceModuleBoundariesRule[1])
  ) {
    return enforceModuleBoundariesRule[1] as EslintRuleModuleBoundariesOptions;
  } else {
    return undefined;
  }
}

function isOverrideFilesEqual(
  override: EslintOverride,
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

export const ESLINT_OVERRIDE_FILES_ALL: readonly string[] = [
  '*.ts',
  '*.tsx',
  '*.js',
  '*.jsx',
];
export const ESLINT_OVERRIDE_FILES_TS: readonly string[] = ['*.ts', '*.tsx'];
export const ESLINT_OVERRIDE_FILES_JS: readonly string[] = ['*.js', '*.jsx'];
export const ESLINT_OVERRIDE_FILES_JSX: readonly string[] = ['*.tsx', '*.jsx'];
