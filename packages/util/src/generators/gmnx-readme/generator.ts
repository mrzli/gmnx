import path from 'path';
import { generateFiles, logger, Tree } from '@nrwl/devkit';
import {
  AnyValue,
  filterOutNullish,
  identifyFn,
  mapWithSeparators,
  ReadonlyRecord,
} from '@gmjs/util';
import { getNpmScope } from '@gmnx/internal-util';
import { stringArrayToLines } from '@gmjs/lib-util';
import { getWorkspaceTools } from './util/workspace-tools-util';
import { NameToolSchemaPair, ProjectData } from './util/workspace-tools';
import { ToolSchemaExample } from './util/tool-schema';

interface ReadmeContent {
  readonly usingGmnxPlugins: string;
}

export async function generateGmnxReadme(tree: Tree): Promise<void> {
  const readmeContent: ReadmeContent = {
    usingGmnxPlugins: getUsingGmnxPluginsText(tree),
  };

  addFiles(tree, readmeContent);
}

function addFiles(tree: Tree, readmeContent: ReadmeContent): void {
  const templateOptions: ReadonlyRecord<string, AnyValue> = {
    ...readmeContent,
    template: '',
  };
  generateFiles(tree, path.join(__dirname, 'files'), '', templateOptions);
}

function getUsingGmnxPluginsText(tree: Tree): string {
  const npmScope = getNpmScope(tree);
  const workspaceTools = getWorkspaceTools(tree);

  const pluginTexts = mapWithSeparators(
    workspaceTools.projects,
    (p) => getGmnxPluginText(npmScope, p),
    () => ''
  );

  return stringArrayToLines(pluginTexts);
}

function getGmnxPluginText(npmScope: string, project: ProjectData): string {
  return processTexts([
    `### \`@${npmScope}/${project.name}\``,
    getGmnxGeneratorsText(project),
    getGmnxExecutorsText(project),
  ]);
}

function getGmnxGeneratorsText(project: ProjectData): string | undefined {
  const generators = project.generators;

  if (!generators || generators.schemas.length === 0) {
    return undefined;
  }

  return processTexts([
    '### Generators',
    ...generators.schemas.map(getGmnxToolText),
  ]);
}

function getGmnxExecutorsText(project: ProjectData): string | undefined {
  const executors = project.executors;

  if (!executors || executors.schemas.length === 0) {
    return undefined;
  }

  return processTexts([
    '### Executors',
    ...executors.schemas.map(getGmnxToolText),
  ]);
}

function getGmnxToolText(schemaPair: NameToolSchemaPair): string {
  const name = schemaPair.name;
  const description = schemaPair.schema.description;
  if (!description) {
    logger.warn(`Tool '${name}' does not have a description!`);
  }

  const examples = schemaPair.schema.examples;
  if (!examples) {
    logger.warn(`Tool '${name}' does not have examples!`);
  }

  return processTexts([
    `\`${name}\``,
    getExamplesText(examples),
    getDescriptionText(description),
  ]);
}

function getExamplesText(
  examples: readonly ToolSchemaExample[] | undefined
): string | undefined {
  if (!examples || examples.length === 0) {
    return undefined;
  }

  return stringArrayToLines([
    'Example usage:',
    '',
    '```zsh',
    ...mapWithSeparators(
      examples,
      (item) => stringArrayToLines([item.description, item.command]),
      () => ''
    ),
    '```',
  ]);
}

function getDescriptionText(
  description: string | undefined
): string | undefined {
  if (!description) {
    return undefined;
  }

  return stringArrayToLines(['Description:', '', description]);
}

function processTexts(texts: readonly (string | undefined)[]): string {
  const filteredTexts = filterOutNullish(texts);
  const textsWithSeparators = mapWithSeparators(
    filteredTexts,
    identifyFn,
    () => ''
  );
  return stringArrayToLines(textsWithSeparators);
}

export default generateGmnxReadme;
