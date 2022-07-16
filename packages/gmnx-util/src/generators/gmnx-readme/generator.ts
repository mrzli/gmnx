import path from 'path';
import { getWorkspaceLayout, logger, Tree } from '@nrwl/devkit';
import { filterOutNullish, identifyFn, mapWithSeparators } from '@gmjs/util';
import { writeText } from '@gmnx/internal-util';
import { stringArrayToLines } from '@gmjs/lib-util';
import {
  getWorkspaceTools,
  hasAnyDocumentedExecutor,
  hasAnyDocumentedGenerator,
  hasAnyDocumentedTool,
  isSchemaDocumented,
} from './util/workspace-tools-util';
import { NameToolSchemaPair, ProjectData } from './util/workspace-tools';
import { ToolSchemaExample } from './util/tool-schema';
import { readTextSync } from '@gmjs/fs-util';

interface ReadmeContent {
  readonly intro: string;
  readonly usingGmnxPlugins: string;
  readonly exampleUsage: string;
}

export async function generateGmnxReadme(tree: Tree): Promise<void> {
  const readmeContent: ReadmeContent = {
    intro: readTextSync(path.join(__dirname, 'files', 'readme-intro.md.txt')),
    usingGmnxPlugins: getUsingGmnxPluginsText(tree),
    exampleUsage: readTextSync(
      path.join(__dirname, 'files', 'readme-example-usage.md.txt')
    ),
  };

  createReadme(tree, readmeContent);
}

function createReadme(tree: Tree, readmeContent: ReadmeContent): void {
  const content =
    readmeContent.intro +
    readmeContent.usingGmnxPlugins +
    readmeContent.exampleUsage;
  writeText(tree, 'README.md', content);
}

function getUsingGmnxPluginsText(tree: Tree): string {
  const npmScope = getWorkspaceLayout(tree).npmScope;
  const workspaceTools = getWorkspaceTools(tree);

  const documentedProjects =
    workspaceTools.projects.filter(hasAnyDocumentedTool);

  const pluginTexts = mapWithSeparators(
    documentedProjects,
    (p) => getGmnxPluginText(npmScope, p),
    () => ''
  );

  return stringArrayToLines([
    '## Using `gmnx` Plugins',
    '',
    ...pluginTexts,
    '',
    '',
  ]);
}

function getGmnxPluginText(npmScope: string, project: ProjectData): string {
  return processTexts([
    `### \`@${npmScope}/${project.name}\``,
    getGmnxGeneratorsText(project),
    getGmnxExecutorsText(project),
  ]);
}

function getGmnxGeneratorsText(project: ProjectData): string | undefined {
  if (!hasAnyDocumentedGenerator(project)) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const generators = project.generators!;

  return processTexts([
    '### Generators',
    ...generators.schemas.map(getGmnxToolText),
  ]);
}

function getGmnxExecutorsText(project: ProjectData): string | undefined {
  if (!hasAnyDocumentedExecutor(project)) {
    return undefined;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const executors = project.executors!;

  return processTexts([
    '### Executors',
    ...executors.schemas.map(getGmnxToolText),
  ]);
}

function getGmnxToolText(schemaPair: NameToolSchemaPair): string | undefined {
  if (!isSchemaDocumented(schemaPair)) {
    return undefined;
  }

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
      (item) => stringArrayToLines([`# ${item.description}`, item.command]),
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
