import { readJson, Tree, writeJson } from '@nrwl/devkit';
import { readText, writeText } from '@gmnx/internal-util';
import { stringArrayToLines } from '@gmjs/lib-util';
import { filterOutNullish } from '@gmjs/util';
import ts from 'typescript';
import generateEslintConfigUpdates from '../eslint-config-updates/generator';

const GITIGNORE_FILE_PATH = '.gitignore';
const README_FILE_PATH = 'README.md';
const TSCONFIG_FILE_PATH = 'tsconfig.base.json';

const TO_IGNORE: readonly string[] = ['/input/', '/output/', '/local-docs/'];
const DEFAULT_README_LINE_MATCH =
  'This project was generated using [Nx](https://nx.dev).';

// for some reason 'type-fest' ConditionalKey<ts.CompilerOptions, boolean> will not work
// even though the IDE will show proper union
type TsConfigOptionKey = keyof ts.CompilerOptions;

const TSCONFIG_BOOLEAN_OPTIONS_TO_SET: TsConfigOptionKey[] = [
  'strict',
  'esModuleInterop',
  'allowSyntheticDefaultImports',
  'resolveJsonModule',
  'noFallthroughCasesInSwitch',
  'noImplicitOverride',
  'noImplicitReturns',
  'noUncheckedIndexedAccess',
  'forceConsistentCasingInFileNames',
];

export async function generateWorkspaceInitialSetup(tree: Tree): Promise<void> {
  updateGitignore(tree);
  updateReadme(tree);
  updateTsConfig(tree);
  await generateEslintConfigUpdates(tree);
}

function updateGitignore(tree: Tree): void {
  const gitignore = readText(tree, GITIGNORE_FILE_PATH);
  const gitignoreLines = gitignore.split('\n');
  const gitignoreLinesSet = new Set(gitignoreLines);
  const anyMissing = TO_IGNORE.some((l) => !gitignoreLinesSet.has(l));
  if (!anyMissing) {
    return;
  }

  const lastLineEmpty =
    gitignoreLines.length > 0 &&
    gitignoreLines[gitignoreLines.length - 1] === '';

  const updatedGitignore = stringArrayToLines(
    filterOutNullish([
      ...gitignoreLines,
      lastLineEmpty ? undefined : '',
      ...TO_IGNORE.map((l) => (!gitignoreLinesSet.has(l) ? l : undefined)),
    ])
  );
  writeText(tree, GITIGNORE_FILE_PATH, updatedGitignore);
}

function updateReadme(tree: Tree): void {
  const readme = readText(tree, README_FILE_PATH);

  // only update default README, skip if it does not have a specific default line
  if (!readme.split('\n').includes(DEFAULT_README_LINE_MATCH)) {
    return;
  }

  writeText(tree, README_FILE_PATH, 'JS monorepo.');
}

function updateTsConfig(tree: Tree): void {
  const tsConfig = readJson(tree, TSCONFIG_FILE_PATH);
  const options = tsConfig.compilerOptions;
  for (const optionKey of TSCONFIG_BOOLEAN_OPTIONS_TO_SET) {
    if (!options[optionKey]) {
      options[optionKey] = true;
    }
  }
  writeJson(tree, TSCONFIG_FILE_PATH, tsConfig);
}

export default generateWorkspaceInitialSetup;
